import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'rana@gmail.com',
    description: 'Registered user email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '654321',
    description: 'Password reset OTP',
  })
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    example: 'newSecret123',
    minLength: 6,
    description: 'New password (min 6 characters)',
  })
  @MinLength(6)
  newPassword: string;
}
