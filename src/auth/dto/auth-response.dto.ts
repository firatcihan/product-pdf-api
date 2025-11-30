import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthResponseDto {
  @ApiProperty({
    type: String,
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  accessToken: string;

  @ApiProperty({
    type: String,
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    type: String,
    description: 'User email',
    example: 'user@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    type: String,
    description: 'User role',
    example: 'user',
  })
  @Expose()
  role: string;
}
