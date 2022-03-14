import { IsDateString, IsString } from 'class-validator';

export class CollectionDto {
  @IsString()
  name: string;

  @IsDateString()
  launchDate: Date | null;
}
