import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export enum userType {
  user,
  admin,
}

export class CreateAuthDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '123 Main' })
  @IsString()
  @MaxLength(10)
  zipCode: string;

  @ApiProperty({ example: '111-222-333-44' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'demo@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'demo@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  Password: string;
}

export class ForgetPasswordDto {
  @ApiProperty({ example: 'demo@gmail.com' })
  @IsEmail()
  email: string;
}
