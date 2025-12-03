import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { OfferStatusEnum } from '../enum/offer.enum';

const MIN_LIMIT_ALLOWED = 1;
const MAX_LIMIT_ALLOWED = 100;

export class QueryOfferDto {
  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Page number',
    required: false,
    example: 0,
    default: 0,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  page?: number = 0;

  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Limit',
    required: false,
    example: 10,
    default: 10,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(MIN_LIMIT_ALLOWED)
  @Max(MAX_LIMIT_ALLOWED)
  limit?: number = 10;

  @ApiProperty({
    type: String,
    description:
      'Sort by field:order (e.g., offerNumber:asc, date:desc). Default is date:desc',
    required: false,
    example: 'date:desc',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Search by offer number or customer note',
    required: false,
    example: 'TR21',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Filter by customer ID',
    required: false,
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsString()
  customerId?: string;

  @Expose()
  @ApiProperty({
    enum: OfferStatusEnum,
    description: 'Filter by status',
    required: false,
    example: OfferStatusEnum.Sent,
  })
  @IsOptional()
  @IsEnum(OfferStatusEnum)
  status?: OfferStatusEnum;

  convertToQuery(): any {
    const query: any = {};

    if (this.search) {
      query.$or = [
        { offerNumber: { $regex: this.search, $options: 'i' } },
        { customerNote: { $regex: this.search, $options: 'i' } },
        { internalNote: { $regex: this.search, $options: 'i' } },
      ];
    }

    if (this.customerId) {
      query.customerId = this.customerId;
    }

    if (this.status) {
      query.status = this.status;
    }

    return query;
  }
}
