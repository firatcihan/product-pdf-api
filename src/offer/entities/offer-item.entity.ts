import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class OfferItem {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Product ID',
    required: true,
    example: '507f1f77bcf86cd799439011',
  })
  @Prop({ required: true, type: Types.ObjectId })
  @IsString()
  productId: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Product name',
    required: true,
    example: 'Ergonomik Ofis Koltuğu',
  })
  @Prop({ required: true })
  @IsString()
  productName: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Variant ID (index in variants array)',
    required: false,
    example: '0',
  })
  @Prop()
  @IsString()
  @IsOptional()
  variantId?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Variant name',
    required: false,
    example: 'Kırmızı / Geniş',
  })
  @Prop()
  @IsString()
  @IsOptional()
  variantName?: string;

  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Quantity',
    required: true,
    example: 5,
  })
  @Prop({ required: true })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;

  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Unit price',
    required: true,
    example: 1250.5,
  })
  @Prop({ required: true })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Discount percentage',
    required: false,
    example: 10,
  })
  @Prop()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Total price',
    required: true,
    example: 5626.25,
  })
  @Prop({ required: true })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalPrice: number;
}

export const OfferItemSchema = SchemaFactory.createForClass(OfferItem);
