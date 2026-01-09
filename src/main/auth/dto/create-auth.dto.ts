import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export enum userType {
  user,
  admin,
}

export class LoginDto {
  @ApiProperty({ example: 'ranarasul21@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  Password: string;
}

export class ForgetPasswordDto {
  @ApiProperty({ example: 'ranarasul21@gmail.com' })
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
