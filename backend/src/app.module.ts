import { Module } from '@nestjs/common';
import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CollectionModule } from './modules/collection/collection.module';
import { CronModule } from './modules/cron/cron.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CollectionModule,
    CronModule,
  ],
})
export class AppModule {}
