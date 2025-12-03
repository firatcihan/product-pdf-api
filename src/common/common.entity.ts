import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';

export type CommonDocument = HydratedDocument<Common>;

@Schema({ timestamps: true })
export class Common {
  @Expose()
  get id(): string | undefined {
    if ('_id' in this && this._id instanceof Types.ObjectId)
      return this._id.toHexString();
  }

  @Expose()
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Expose()
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const CommonSchema = SchemaFactory.createForClass(Common);
