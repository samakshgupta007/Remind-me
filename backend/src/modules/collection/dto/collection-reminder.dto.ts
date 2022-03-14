import { IsEmail } from 'class-validator';

export class CollectionReminderDto {
  @IsEmail()
  email: string;

  collectionId: number;
}
