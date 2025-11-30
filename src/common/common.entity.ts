import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';
import { IsObject } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { ObjectIdTransform } from '../utils/objectId.transform';

export type CommonDocument = HydratedDocument<Common>;

@Schema({ timestamps: true })
export class Common {
  @Expose()
  get id(): string | undefined {
    if ('_id' in this && this._id instanceof Types.ObjectId)
      return this._id.toHexString();
  }

  @Prop({ type: Types.ObjectId, ref: 'Realm', required: true })
  @Transform(ObjectIdTransform())
  @IsObject()
  @Expose()
  realmId: Types.ObjectId;

  @Expose()
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Expose()
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const CommonSchema = SchemaFactory.createForClass(Common);
