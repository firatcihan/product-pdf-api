import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

const MIN_LIMIT_ALLOWED = 1;
const MAX_LIMIT_ALLOWED = 100;

export class QueryProductDto {
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
      'Sort by field:order (e.g., name:asc, createdAt:desc). Default is createdAt:desc',
    required: false,
    example: 'name:asc',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Search by product name',
    required: false,
    example: 'Koltuk',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Filter by category ID',
    required: false,
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  convertToQuery(): any {
    const query: any = {};

    if (this.name) {
      query.name = { $regex: this.name, $options: 'i' };
    }

    if (this.categoryId) {
      query.categoryId = this.categoryId;
    }

    return query;
  }
}
