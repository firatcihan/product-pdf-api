import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    type: String,
    description: 'User email',
    required: true,
    example: 'user@example.com',
  })
  @Expose()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'User password',
    required: true,
    example: 'SecurePassword123!',
    minLength: 6,
  })
  @Expose()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    type: String,
    description: 'User name',
    required: false,
    example: 'John Doe',
  })
  @Expose()
  @IsString()
  @IsOptional()
  name?: string;
}
