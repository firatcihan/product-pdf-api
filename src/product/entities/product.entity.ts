import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { Common } from '../../common/common.entity';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: false })
export class ProductPrice {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Currency code',
    required: true,
    example: 'TRY',
    enum: ['TRY', 'USD', 'EUR', 'GBP'],
  })
  @IsString()
  currency: 'TRY' | 'USD' | 'EUR' | 'GBP';

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Price as string for precision',
    required: true,
    example: '1250.50',
  })
  @IsString()
  price: string;
}

export const ProductPriceSchema = SchemaFactory.createForClass(ProductPrice);

@Schema({ _id: false })
export class VariantAttribute {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Attribute key',
    required: true,
    example: 'Renk',
  })
  @IsString()
  key: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Attribute value',
    required: true,
    example: 'Kırmızı',
  })
  @IsString()
  value: string;
}

export const VariantAttributeSchema =
  SchemaFactory.createForClass(VariantAttribute);

@Schema({ _id: false })
export class ProductVariant {
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
  name?: string;

  @Expose()
  @ApiProperty({
    type: [VariantAttribute],
    description: 'Variant attributes',
    required: true,
  })
  @Prop({ schema: [VariantAttributeSchema], default: [] })
  @Type(() => VariantAttribute)
  @IsArray()
  attributes: VariantAttribute[];

  @Expose()
  @ApiProperty({
    type: [ProductPrice],
    description: 'Prices for each currency',
    required: true,
  })
  @Prop({ schema: [ProductPriceSchema], default: [] })
  @Type(() => ProductPrice)
  @IsArray()
  prices: ProductPrice[];
}

export const ProductVariantSchema =
  SchemaFactory.createForClass(ProductVariant);

@Schema({ timestamps: true })
export class Product extends Common {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Product name',
    required: true,
    example: 'Ergonomik Ofis Koltuğu',
  })
  @Prop({ required: true, index: true })
  @IsString()
  name: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Product description',
    required: false,
    example: 'Yüksek kaliteli ergonomik tasarım',
  })
  @Prop()
  @IsString()
  @IsOptional()
  description?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Category ID',
    required: false,
    example: '507f1f77bcf86cd799439011',
  })
  @Prop({ index: true })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @Expose()
  @ApiProperty({
    type: [ProductVariant],
    description: 'Product variants',
    required: true,
  })
  @Prop({ schema: [ProductVariantSchema], default: [] })
  @Type(() => ProductVariant)
  @IsArray()
  variants: ProductVariant[];

  @Expose()
  @ApiProperty({
    type: [ProductPrice],
    description: 'Base prices (fallback when no variants)',
    required: false,
  })
  @Prop({ schema: [ProductPriceSchema], default: [] })
  @Type(() => ProductPrice)
  @IsArray()
  @IsOptional()
  basePrices?: ProductPrice[];

  @Expose()
  @ApiProperty({
    type: [String],
    description: 'Image URLs',
    required: false,
    example: ['https://example.com/image1.jpg'],
  })
  @Prop({ type: [String], default: [] })
  @IsArray()
  @IsOptional()
  imageUrls?: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Add indexes
ProductSchema.index({ name: 1 });
ProductSchema.index({ categoryId: 1 });
