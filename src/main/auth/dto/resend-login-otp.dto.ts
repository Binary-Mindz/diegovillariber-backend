import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResendLoginOtpDto {
  @ApiProperty({
    example: 'temp-login-token-here',
    description: 'Temporary token returned from login when 2FA is enabled',
  })
  @IsString()
  @IsNotEmpty()
  tempToken!: string;
}