import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Order } from '../entities/order.entity';

export class PagedOrderResponseDto {
  @ApiProperty({
    description: 'Order list',
    type: [Order],
    required: true,
  })
  @Expose()
  @Type(() => Order)
  results: Order[];

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
    description: 'Total count of orders matching the query',
    required: true,
    example: 100,
  })
  @Expose()
  count: number;

  @ApiProperty({
    type: Number,
    description: 'Limit per page',
    required: true,
    example: 10,
  })
  @Expose()
  limit: number;

  constructor(results: Order[], page: number, count: number, limit: number) {
    this.results = results;
    this.page = page;
    this.count = count;
    this.limit = limit;
  }
}

export class SingleOrderResponseDto {
  @ApiProperty({
    description: 'Order',
    type: Order,
    required: true,
  })
  @Expose()
  @Type(() => Order)
  result: Order;

  constructor(order: Order) {
    this.result = order;
  }
}
