import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { Common } from 'src/common/common.entity';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User extends Common {
  @ApiProperty({
    type: String,
    description: 'User email',
    required: true,
    example: 'user@example.com',
  })
  @Prop({ required: true, unique: true, lowercase: true, index: true })
  @Expose()
  @IsEmail()
  email: string;

  @ApiHideProperty()
  @Prop({ required: true })
  @Exclude()
  password: string;

  @ApiProperty({
    type: String,
    description: 'User name',
    required: false,
    example: 'John Doe',
  })
  @Prop()
  @Expose()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: String,
    description: 'User role',
    required: true,
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER,
  })
  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
    required: true,
  })
  @Expose()
  @IsEnum(UserRole)
  role: UserRole = UserRole.USER;

  @ApiProperty({
    type: Date,
    description: 'Last login information',
    required: false,
  })
  @Expose()
  @IsOptional()
  @Prop({ type: Date })
  lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
