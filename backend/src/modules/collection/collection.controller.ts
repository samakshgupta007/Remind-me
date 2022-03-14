import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionReminderDto } from './dto/collection-reminder.dto';
import { CollectionDto } from './dto/collection.dto';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get('/')
  async findAll() {
    // get all posts in the db
    return await this.collectionService.findAll();
  }

  @Post('/reminder')
  async createReminder(@Body() collectionReminderDto: CollectionReminderDto) {
    return await this.collectionService.createReminder(collectionReminderDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() collectionData: CollectionDto) {
    return this.collectionService.updateCollection(id, collectionData);
  }
}
