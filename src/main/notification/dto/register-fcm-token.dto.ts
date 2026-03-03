import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class RegisterFcmTokenDto {
  @ApiProperty({ example: 'fcm-token-string' })
  @IsString()
  @MaxLength(5000)
  token: string;

  @ApiProperty({ example: 'ANDROID' })
  @IsString()
  @MaxLength(30)
  deviceType: string;
}