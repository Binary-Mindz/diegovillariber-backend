import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'John deo',
    description: 'User name is required',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'ranarasul21@gmail.com',
    description: 'User email address (must be unique)',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'secret123',
    minLength: 6,
    description: 'Password (minimum 6 characters)',
  })
  @MinLength(6)
  password: string;
}
