import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class ProductPriceDto {
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

export class VariantAttributeDto {
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

export class ProductVariantDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Variant name',
    required: false,
    example: 'Kırmızı / Geniş',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @Expose()
  @ApiProperty({
    type: [VariantAttributeDto],
    description: 'Variant attributes',
    required: true,
  })
  @Type(() => VariantAttributeDto)
  @ValidateNested({ each: true })
  @IsArray()
  attributes: VariantAttributeDto[];

  @Expose()
  @ApiProperty({
    type: [ProductPriceDto],
    description: 'Prices for each currency',
    required: true,
  })
  @Type(() => ProductPriceDto)
  @ValidateNested({ each: true })
  @IsArray()
  prices: ProductPriceDto[];
}

export class CreateProductDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Product name',
    required: true,
    example: 'Ergonomik Ofis Koltuğu',
  })
  @IsString()
  name: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Product description',
    required: false,
    example: 'Yüksek kaliteli ergonomik tasarım',
  })
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
  @IsString()
  @IsOptional()
  categoryId?: string;

  @Expose()
  @ApiProperty({
    type: [ProductVariantDto],
    description: 'Product variants',
    required: false,
  })
  @Type(() => ProductVariantDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  variants?: ProductVariantDto[];

  @Expose()
  @ApiProperty({
    type: [ProductPriceDto],
    description: 'Base prices (fallback when no variants)',
    required: false,
  })
  @Type(() => ProductPriceDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  basePrices?: ProductPriceDto[];

  @Expose()
  @ApiProperty({
    type: [String],
    description: 'Image URLs',
    required: false,
    example: ['https://example.com/image1.jpg'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];
}
