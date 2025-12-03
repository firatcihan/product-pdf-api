import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Customer } from '../entities/customer.entity';

export class PagedCustomerResponseDto {
  @ApiProperty({
    description: 'Customer list',
    type: [Customer],
    required: true,
  })
  @Expose()
  @Type(() => Customer)
  results: Customer[];

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
    description: 'Total count of customers matching the query',
    required: true,
    example: 100,
  })
  @Expose()
  count: number;

  constructor(results: Customer[], page: number, count: number) {
    this.results = results;
    this.page = page;
    this.count = count;
  }
}

export class SingleCustomerResponseDto {
  @ApiProperty({
    description: 'Customer',
    type: Customer,
    required: true,
  })
  @Expose()
  @Type(() => Customer)
  result: Customer;

  constructor(customer: Customer) {
    this.result = customer;
  }
}
