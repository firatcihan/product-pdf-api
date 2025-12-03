import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Product } from '../entities/product.entity';

export class PagedProductResponseDto {
  @ApiProperty({
    description: 'Product list',
    type: [Product],
    required: true,
  })
  @Expose()
  @Type(() => Product)
  results: Product[];

  @ApiProperty({
    description: 'Page number',
    type: Number,
    example: 0,
    required: true,
  })
  @Expose()
  @Type(() => Number)
  page: number;

  @ApiProperty({
    type: Number,
    description: 'Total count of products matching the query',
    required: true,
    example: 100,
  })
  @Expose()
  count: number;

  constructor(results: Product[], page: number, count: number) {
    this.results = results;
    this.page = page;
    this.count = count;
  }
}

export class SingleProductResponseDto {
  @ApiProperty({
    description: 'Product',
    type: Product,
    required: true,
  })
  @Expose()
  @Type(() => Product)
  result: Product;

  constructor(product: Product) {
    this.result = product;
  }
}
