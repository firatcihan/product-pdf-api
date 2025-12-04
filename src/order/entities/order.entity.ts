import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { Common } from '../../common/common.entity';
import {
  CurrencyEnum,
  OrderStatusEnum,
  PaymentStatusEnum,
} from '../enum/order.enum';
import { OrderItem, OrderItemSchema } from './order-item.entity';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order extends Common {
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
    description: 'Source offer ID (if created from offer)',
    required: false,
    example: '507f1f77bcf86cd799439011',
  })
  @Prop({ type: Types.ObjectId })
  @IsString()
  @IsOptional()
  sourceOfferId?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Order number (e.g., SO-2025-001)',
    required: true,
    example: 'SO-2025-001',
  })
  @Prop({ required: true, unique: true, index: true })
  @IsString()
  orderNumber: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Order date (ISO format)',
    required: true,
    example: '2025-12-03T00:00:00.000Z',
  })
  @Prop({ required: true })
  @IsDateString()
  date: string;

  @Expose()
  @ApiProperty({
    enum: OrderStatusEnum,
    description: 'Order status',
    required: true,
    example: OrderStatusEnum.Draft,
  })
  @Prop({ required: true, enum: OrderStatusEnum, index: true })
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

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
    type: [OrderItem],
    description: 'Order items',
    required: true,
  })
  @Prop({ type: [OrderItemSchema], required: true })
  @Type(() => OrderItem)
  @IsArray()
  items: OrderItem[];

  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Delivery days (e.g., 180)',
    required: false,
    example: 180,
  })
  @Prop()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  deliveryDays?: number;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Planned delivery date (ISO format)',
    required: false,
    example: '2026-06-01T00:00:00.000Z',
  })
  @Prop()
  @IsDateString()
  @IsOptional()
  deliveryDate?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Delivery text for PDF',
    required: false,
    example: '180 gün içerisinde teslim edilecektir',
  })
  @Prop()
  @IsString()
  @IsOptional()
  deliveryText?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description:
      'Payment title (e.g., "Siparişte %40 Nakit, Teslimde %60 Nakit")',
    required: false,
    example: 'Siparişte %40 Nakit, Teslimde %60 Nakit',
  })
  @Prop()
  @IsString()
  @IsOptional()
  paymentTitle?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Payment details (long description)',
    required: false,
    example: 'Ödeme koşulları detaylı açıklama',
  })
  @Prop()
  @IsString()
  @IsOptional()
  paymentDetails?: string;

  @Expose()
  @ApiProperty({
    enum: PaymentStatusEnum,
    description: 'Payment status',
    required: true,
    example: PaymentStatusEnum.Unpaid,
  })
  @Prop({ required: true, enum: PaymentStatusEnum, index: true })
  @IsEnum(PaymentStatusEnum)
  paymentStatus: PaymentStatusEnum;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Customer note (visible in PDF)',
    required: false,
    example: 'Özel not',
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
    example: 'İç kullanım notu',
  })
  @Prop()
  @IsString()
  @IsOptional()
  internalNote?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Approved by name',
    required: false,
    example: 'İbrahim NAZİRLİ',
  })
  @Prop()
  @IsString()
  @IsOptional()
  approvedByName?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Approved by title',
    required: false,
    example: 'Genel Müdür',
  })
  @Prop()
  @IsString()
  @IsOptional()
  approvedByTitle?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Approval date (ISO format)',
    required: false,
    example: '2025-12-03T10:30:00.000Z',
  })
  @Prop()
  @IsDateString()
  @IsOptional()
  approvedAt?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Signature image URL',
    required: false,
    example: 'https://example.com/signatures/signature.png',
  })
  @Prop()
  @IsString()
  @IsOptional()
  signatureUrl?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Add indexes
OrderSchema.index({ customerId: 1, status: 1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ date: -1 });
OrderSchema.index({ status: 1, paymentStatus: 1 });
