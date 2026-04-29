import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyLoginOtpDto {
  @ApiProperty({
    example: 'temp-login-token-here',
    description: 'Temporary token returned from login when 2FA is enabled',
  })
  @IsString()
  @IsNotEmpty()
  tempToken!: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP sent to email for login verification',
  })
  @IsString()
  @Length(6, 6)
  otp!: string;
}