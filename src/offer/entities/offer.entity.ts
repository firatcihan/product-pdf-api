import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { Common } from '../../common/common.entity';
import { CurrencyEnum, OfferStatusEnum } from '../enum/offer.enum';
import { OfferItem, OfferItemSchema } from './offer-item.entity';

export type OfferDocument = HydratedDocument<Offer>;

@Schema({ timestamps: true })
export class Offer extends Common {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Customer ID',
    required: true,
    example: '507f1f77bcf86cd799439011',
  })
  @Prop({ required: true, type: Types.ObjectId, index: true })
  @IsString()
  customerId: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Offer number (e.g., TR21/01-038)',
    required: true,
    example: 'TR21/01-038',
  })
  @Prop({ required: true, unique: true, index: true })
  @IsString()
  offerNumber: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Offer date (ISO format)',
    required: true,
    example: '2025-12-03T00:00:00.000Z',
  })
  @Prop({ required: true })
  @IsDateString()
  date: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Valid until date (ISO format)',
    required: true,
    example: '2025-12-31T23:59:59.999Z',
  })
  @Prop({ required: true })
  @IsDateString()
  validUntil: string;

  @Expose()
  @ApiProperty({
    enum: OfferStatusEnum,
    description: 'Offer status',
    required: true,
    example: OfferStatusEnum.Draft,
  })
  @Prop({ required: true, enum: OfferStatusEnum, index: true })
  @IsEnum(OfferStatusEnum)
  status: OfferStatusEnum;

  @Expose()
  @ApiProperty({
    enum: CurrencyEnum,
    description: 'Currency',
    required: true,
    example: CurrencyEnum.TRY,
  })
  @Prop({ required: true, enum: CurrencyEnum })
  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;

  @Expose()
  @ApiProperty({
    type: [OfferItem],
    description: 'Offer items',
    required: true,
  })
  @Prop({ type: [OfferItemSchema], required: true })
  @Type(() => OfferItem)
  @IsArray()
  items: OfferItem[];

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Customer note (visible to customer)',
    required: false,
    example: 'Özel indirim uygulanmıştır',
  })
  @Prop()
  @IsString()
  @IsOptional()
  customerNote?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Internal note (for internal use only)',
    required: false,
    example: 'VIP müşteri için ekstra indirim yapıldı',
  })
  @Prop()
  @IsString()
  @IsOptional()
  internalNote?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Order ID created from this offer',
    required: false,
    example: '507f1f77bcf86cd799439011',
  })
  @Prop({ type: Types.ObjectId })
  @IsString()
  @IsOptional()
  orderId?: string;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);

// Add indexes
OfferSchema.index({ customerId: 1, status: 1 });
OfferSchema.index({ offerNumber: 1 });
OfferSchema.index({ date: -1 });
OfferSchema.index({ validUntil: 1 });
