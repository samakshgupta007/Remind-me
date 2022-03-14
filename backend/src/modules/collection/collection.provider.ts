import { Collection } from './collection.entity';
import { Reminder } from './reminder.entity';
import {
  COLLECTION_REPOSITORY,
  REMINDER_REPOSITORY,
} from '../../core/constants';

export const collectionProviders = [
  {
    provide: COLLECTION_REPOSITORY,
    useValue: Collection,
  },
  {
    provide: REMINDER_REPOSITORY,
    useValue: Reminder,
  },
];
