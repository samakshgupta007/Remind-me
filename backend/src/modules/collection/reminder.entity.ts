import {
  Table,
  Model,
  ForeignKey,
  BelongsTo,
  Column,
  DataType,
} from 'sequelize-typescript';
import { Collection } from './collection.entity';

@Table
export class Reminder extends Model<Reminder> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  @ForeignKey(() => Collection)
  collectionId: number;

  @BelongsTo(() => Collection)
  collection: Collection;
}
