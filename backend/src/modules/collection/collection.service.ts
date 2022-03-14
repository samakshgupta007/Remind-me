import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Collection } from './collection.entity';
import { Reminder } from './reminder.entity';
import { CollectionReminderDto } from './dto/collection-reminder.dto';
import {
  COLLECTION_REPOSITORY,
  REMINDER_REPOSITORY,
} from '../../core/constants';
import * as moment from 'moment';

@Injectable()
export class CollectionService {
  constructor(
    @Inject(COLLECTION_REPOSITORY)
    private readonly collectionRepository: typeof Collection,
    @Inject(REMINDER_REPOSITORY)
    private readonly reminderRepository: typeof Reminder,
  ) {}

  async insertDummyData() {
    await this.collectionRepository.bulkCreate([
      {
        id: 1,
        name: 'Skies of Tokyo',
        launchDate: moment('2022-06-01').utcOffset('+00:00').toDate(),
      },
      {
        id: 2,
        name: 'Reigns of Valour',
        launchDate: moment('2022-05-14').utcOffset('+00:00').toDate(),
      },
      {
        id: 3,
        name: 'James Bond Collectibles',
        launchDate: moment('2022-04-20').utcOffset('+00:00').toDate(),
      },
      {
        id: 4,
        name: 'Football Stars',
        launchDate: moment('2022-07-06').utcOffset('+00:00').toDate(),
      },
      {
        id: 5,
        name: 'Views from a Skyscraper',
        launchDate: moment('2022-05-21').utcOffset('+00:00').toDate(),
      },
      {
        id: 6,
        name: 'Legends of Anime',
        launchDate: moment('2022-03-27').utcOffset('+00:00').toDate(),
      },
    ]);
  }

  async findAll(): Promise<Collection[]> {
    let collections = await this.collectionRepository.findAll<Collection>();

    // Insert Dummy Data is Collection Count does not match
    if (collections.length !== 6) {
      await this.insertDummyData();
      collections = await this.collectionRepository.findAll<Collection>();
    }

    return collections;
  }

  async createReminder(collectionReminderDto: CollectionReminderDto) {
    const { email, collectionId } = collectionReminderDto;

    const existingReminder = await this.reminderRepository.findOne<Reminder>({
      where: { collectionId, email },
    });
    if (existingReminder) {
      throw new ConflictException(
        `Reminder for this collection already exists for ${email}`,
      );
    }

    await this.reminderRepository.create({ collectionId, email });

    return {
      message: 'Reminder set!',
    };
  }

  async updateCollection(id, collectionData) {
    console.log('got here now', collectionData);
    await this.collectionRepository.update(
      { ...collectionData },
      { where: { id }, returning: true },
    );

    return { message: 'Collection updated successfully' };
  }
}
