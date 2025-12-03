import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Offer } from '../entities/offer.entity';

export class PagedOfferResponseDto {
  @ApiProperty({
    description: 'Offer list',
    type: [Offer],
    required: true,
  })
  @Expose()
  @Type(() => Offer)
  results: Offer[];

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
    description: 'Total count of offers matching the query',
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

  constructor(results: Offer[], page: number, count: number, limit: number) {
    this.results = results;
    this.page = page;
    this.count = count;
    this.limit = limit;
  }
}

export class SingleOfferResponseDto {
  @ApiProperty({
    description: 'Offer',
    type: Offer,
    required: true,
  })
  @Expose()
  @Type(() => Offer)
  result: Offer;

  constructor(offer: Offer) {
    this.result = offer;
  }
}
