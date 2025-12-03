import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

const MIN_LIMIT_ALLOWED = 1;
const MAX_LIMIT_ALLOWED = 100;

export class QueryCustomerDto {
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
      'Sort by field:order (e.g., firstName:asc, createdAt:desc). Default is createdAt:desc',
    required: false,
    example: 'firstName:asc',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Search by name, email, phone, or company name',
    required: false,
    example: 'John',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @Expose()
  @ApiProperty({
    type: Boolean,
    description: 'Filter by corporate status',
    required: false,
    example: false,
  })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isCorporate?: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    description: 'Filter by active status',
    required: false,
    example: true,
  })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Filter by city',
    required: false,
    example: 'Istanbul',
  })
  @IsOptional()
  @IsString()
  city?: string;

  convertToQuery(): any {
    const query: any = {};

    if (this.search) {
      query.$or = [
        { firstName: { $regex: this.search, $options: 'i' } },
        { lastName: { $regex: this.search, $options: 'i' } },
        { email: { $regex: this.search, $options: 'i' } },
        { phone: { $regex: this.search, $options: 'i' } },
        { companyName: { $regex: this.search, $options: 'i' } },
      ];
    }

    if (this.isCorporate !== undefined) {
      query.isCorporate = this.isCorporate;
    }

    if (this.isActive !== undefined) {
      query.isActive = this.isActive;
    }

    if (this.city) {
      query.city = { $regex: this.city, $options: 'i' };
    }

    return query;
  }
}
