import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { CollectionModule } from '../collection/collection.module';
import { collectionProviders } from '../collection/collection.provider';

@Module({
  imports: [ScheduleModule.forRoot(), CollectionModule, ConfigModule.forRoot()],
  providers: [CronService, ...collectionProviders],
  exports: [CronService],
})
export class CronModule {}
