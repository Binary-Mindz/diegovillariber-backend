import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RegisterDeviceTokenDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiPropertyOptional({ example: 'android' })
  @IsOptional()
  @IsString()
  platform?: string;
}