import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'ranarasul21@gmail.com',
    description: 'Email to receive password reset OTP',
  })
  @IsEmail()
  email: string;
}
