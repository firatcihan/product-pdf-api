import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
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
  })
  @Expose()
  @IsString()
  password: string;
}
