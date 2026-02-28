import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSuspensionDto {
  @ApiPropertyOptional({ example: 'Ohlins FGRT' })
  @IsOptional()
  @IsString()
  frontSuspension?: string;

  @ApiPropertyOptional({ example: 'Ohlins TTX' })
  @IsOptional()
  @IsString()
  rearSuspension?: string;

  @ApiPropertyOptional({ example: 'Brembo M50' })
  @IsOptional()
  @IsString()
  frontBrakes?: string;

  @ApiPropertyOptional({ example: 'Brembo' })
  @IsOptional()
  @IsString()
  rearBrake?: string;

  @ApiPropertyOptional({ example: 'ABS enabled' })
  @IsOptional()
  @IsString()
  abs?: string;

  @ApiPropertyOptional({ example: 'Track setup: stiff front, medium rear' })
  @IsOptional()
  @IsString()
  notes?: string;
}