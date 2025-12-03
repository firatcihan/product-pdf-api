import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Customer first name',
    required: true,
    example: 'John',
  })
  @IsString()
  firstName: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Customer last name',
    required: true,
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Company name',
    required: false,
    example: 'Acme Corporation',
  })
  @IsString()
  @IsOptional()
  companyName?: string;

  @Expose()
  @ApiProperty({
    type: Boolean,
    description: 'Is corporate customer',
    required: false,
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isCorporate?: boolean;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Customer email',
    required: false,
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Customer phone number',
    required: false,
    example: '+90 555 123 45 67',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Customer address',
    required: false,
    example: '123 Main St',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'City',
    required: false,
    example: 'Istanbul',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Postal code',
    required: false,
    example: '34000',
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Country',
    required: false,
    example: 'Turkey',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Tax number',
    required: false,
    example: '1234567890',
  })
  @IsString()
  @IsOptional()
  taxNumber?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Contact person (for corporate customers)',
    required: false,
    example: 'Jane Smith',
  })
  @IsString()
  @IsOptional()
  contactPerson?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Internal notes',
    required: false,
    example: 'VIP customer',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @Expose()
  @ApiProperty({
    type: Boolean,
    description: 'Is customer active',
    required: false,
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
