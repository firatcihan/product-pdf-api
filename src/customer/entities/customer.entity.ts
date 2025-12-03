import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { Common } from '../../common/common.entity';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ timestamps: true })
export class Customer extends Common {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Customer first name',
    required: true,
    example: 'John',
  })
  @Prop({ required: true })
  @IsString()
  firstName: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Customer last name',
    required: true,
    example: 'Doe',
  })
  @Prop({ required: true })
  @IsString()
  lastName: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Company name',
    required: false,
    example: 'Acme Corporation',
  })
  @Prop()
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
  @Prop({ default: false })
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
  @Prop({ lowercase: true })
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
  @Prop()
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
  @Prop()
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
  @Prop({ index: true })
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
  @Prop()
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
  @Prop()
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
  @Prop()
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
  @Prop()
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
  @Prop()
  @IsString()
  @IsOptional()
  notes?: string;

  @Expose()
  @ApiProperty({
    type: Boolean,
    description: 'Is customer active',
    required: true,
    example: true,
    default: true,
  })
  @Prop({ required: true, default: true })
  @IsBoolean()
  isActive: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

// Add indexes
CustomerSchema.index({ firstName: 1, lastName: 1 });
CustomerSchema.index({ email: 1 });
CustomerSchema.index({ companyName: 1 });
