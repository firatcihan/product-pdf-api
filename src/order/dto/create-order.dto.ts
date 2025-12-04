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
  ValidateNested,
} from 'class-validator';
import {
  CurrencyEnum,
  OrderStatusEnum,
  PaymentStatusEnum,
} from '../enum/order.enum';
import { OrderItem } from '../entities/order-item.entity';

export class CreateOrderDto {
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
    description: 'Source offer ID (if created from offer)',
    required: false,
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsOptional()
  sourceOfferId?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Order date (ISO format)',
    required: true,
    example: '2025-12-03T00:00:00.000Z',
  })
  @IsDateString()
  date: string;

  @Expose()
  @ApiProperty({
    enum: OrderStatusEnum,
    description: 'Order status',
    required: true,
    example: OrderStatusEnum.Draft,
  })
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

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
    type: [OrderItem],
    description: 'Order items',
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  items: OrderItem[];

  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Delivery days (e.g., 180)',
    required: false,
    example: 180,
  })
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
  @IsEnum(PaymentStatusEnum)
  paymentStatus: PaymentStatusEnum;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Customer note (visible in PDF)',
    required: false,
    example: 'Özel not',
  })
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
  @IsString()
  @IsOptional()
  signatureUrl?: string;
}
