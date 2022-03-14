import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { collectionProviders } from './collection.provider';

@Module({
  controllers: [CollectionController],
  providers: [CollectionService, ...collectionProviders],
  exports: [CollectionService, ...collectionProviders],
})
export class CollectionModule {}
