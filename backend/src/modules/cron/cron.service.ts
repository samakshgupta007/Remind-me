import { Injectable, Inject } from '@nestjs/common';
import * as moment from 'moment';
import Sequelize from 'sequelize';
import * as Bluebird from 'bluebird';
import * as nodemailer from 'nodemailer';
import { Cron } from '@nestjs/schedule';
import {
  REMINDER_REPOSITORY,
  COLLECTION_REPOSITORY,
} from '../../core/constants';
import { Collection } from '../collection/collection.entity';
import { Reminder } from '../collection/reminder.entity';
import { ReminderEmail } from './email-templates/reminder-email';

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;
const user = process.env.SMTP_USER;
const password = process.env.SMTP_PASSWORD;

const Op = Sequelize.Op;

@Injectable()
export class CronService {
  constructor(
    @Inject(REMINDER_REPOSITORY)
    private readonly reminderRepository: typeof Reminder,
    @Inject(COLLECTION_REPOSITORY)
    private readonly collectionRepository: typeof Collection,
  ) {}

  @Cron('0,30 * * * *')
  async sendReminderCron() {
    console.log('Cron Job for Sending Reminders');

    const currentTime = moment();
    const launchingCollections = await this.collectionRepository.findAll({
      attributes: ['id', 'name', 'launchDate'],
      where: {
        [Op.or]: [
          // We add and subtract a minute from each date to account for minor errors and millisecond differences
          {
            launchDate: {
              [Op.between]: [
                moment(currentTime).subtract(1, 'minutes').format(),
                moment(currentTime).add(1, 'minutes').format(),
              ],
            },
          },
          {
            launchDate: {
              [Op.between]: [
                moment(currentTime)
                  .add(30, 'minutes')
                  .subtract(1, 'minutes')
                  .format(),
                moment(currentTime)
                  .add(30, 'minutes')
                  .add(1, 'minutes')
                  .format(),
              ],
            },
          },
          {
            launchDate: {
              [Op.between]: [
                moment(currentTime)
                  .add(1, 'hour')
                  .subtract(1, 'minutes')
                  .format(),
                moment(currentTime).add(1, 'hour').add(1, 'minutes').format(),
              ],
            },
          },
          {
            launchDate: {
              [Op.between]: [
                moment(currentTime).add(1, 'd').subtract(1, 'minutes').format(),
                moment(currentTime).add(1, 'd').add(1, 'minutes').format(),
              ],
            },
          },
        ],
      },
      raw: true,
    });

    const collectionLaunchDate = {} as Record<string, any>;
    const launchingCollectionIDs = launchingCollections.map((el) => {
      collectionLaunchDate[el.id] = {
        launchDate: el.launchDate,
        name: el.name,
      };
      return { collectionId: el.id };
    });

    const remindersToSend = await this.reminderRepository.findAll({
      where: {
        [Op.or]: launchingCollectionIDs,
      },
      raw: true,
    });

    if (remindersToSend.length > 0) {
      await Bluebird.mapSeries(remindersToSend, async (el) => {
        const launchTimeDifference = moment(
          collectionLaunchDate[el.collectionId].launchDate,
        ).diff(moment(), 'minutes');

        const subject = `The collection ${
          collectionLaunchDate[el.collectionId].name
        } is launching ${launchTimeDifference > 10 ? 'SOON' : 'NOW'}`;

        let emailText;
        if (launchTimeDifference > 1430 && launchTimeDifference < 1450) {
          emailText = `REMINDER - THE COLLECTION ${
            collectionLaunchDate[el.collectionId].name
          } LAUNCHES IN 1 Day`;
        } else if (launchTimeDifference > 50 && launchTimeDifference < 70) {
          emailText = `REMINDER - THE COLLECTION ${
            collectionLaunchDate[el.collectionId].name
          } LAUNCHES IN 1 Hour`;
        } else if (launchTimeDifference > 35 && launchTimeDifference < 25) {
          emailText = `REMINDER - THE COLLECTION ${
            collectionLaunchDate[el.collectionId].name
          } LAUNCHES IN 30 Minutes`;
        } else if (launchTimeDifference < 5) {
          emailText = `COLLECTION ${
            collectionLaunchDate[el.collectionId].name
          } IS LAUNCHING NOW!`;
        }

        if (emailText) {
          const htmlData = ReminderEmail({
            text: emailText,
          });

          const emailParams = {
            htmlData,
            subject,
            from: process.env.SENDER_EMAIL,
            to: el.email,
          };
          await this.sendEmail(emailParams);
        }
      });
    }
  }

  async sendEmail({
    htmlData,
    subject,
    from,
    to,
  }: {
    htmlData: string;
    subject: string;
    from?: string | Record<string, any>;
    to?: string | string[];
  }) {
    const transport = nodemailer.createTransport({
      host: host as string,
      port: parseFloat(port) as number,
      auth: {
        user: user as string,
        pass: password as string,
      },
    });

    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: htmlData,
      attachments: [],
    } as any;

    return new Promise((res, rej) => {
      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          return rej(error);
        }
        return res(info);
      });
    });
  }
}
