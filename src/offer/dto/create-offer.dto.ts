import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CurrencyEnum, OfferStatusEnum } from '../enum/offer.enum';
import { OfferItem } from '../entities/offer-item.entity';

export class CreateOfferDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Customer ID',
    required: true,
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  customerId: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Offer number (e.g., TR21/01-038)',
    required: true,
    example: 'TR21/01-038',
  })
  @IsString()
  offerNumber: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Offer date (ISO format)',
    required: true,
    example: '2025-12-03T00:00:00.000Z',
  })
  @IsDateString()
  date: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Valid until date (ISO format)',
    required: true,
    example: '2025-12-31T23:59:59.999Z',
  })
  @IsDateString()
  validUntil: string;

  @Expose()
  @ApiProperty({
    enum: OfferStatusEnum,
    description: 'Offer status',
    required: true,
    example: OfferStatusEnum.Draft,
  })
  @IsEnum(OfferStatusEnum)
  status: OfferStatusEnum;

  @Expose()
  @ApiProperty({
    enum: CurrencyEnum,
    description: 'Currency',
    required: true,
    example: CurrencyEnum.TRY,
  })
  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;

  @Expose()
  @ApiProperty({
    type: [OfferItem],
    description: 'Offer items',
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OfferItem)
  items: OfferItem[];

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Customer note (visible to customer)',
    required: false,
    example: 'Özel indirim uygulanmıştır',
  })
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
  @IsString()
  @IsOptional()
  orderId?: string;
}
