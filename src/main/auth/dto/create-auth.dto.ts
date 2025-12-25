import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
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

export class Otp {
  @ApiProperty({ example: '123456' })
  @IsString()
  otp: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @ApiProperty({ example: 'strongPassword123' })
  password: string;
}
