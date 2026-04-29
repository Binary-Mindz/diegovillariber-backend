import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateWheelsTiresDto {
  @ApiPropertyOptional({ example: 'Michelin Pilot Sport 4S 275/35/19' })
  @IsOptional()
  @IsString()
  tires?: string;

  @ApiPropertyOptional({ example: 'BBS FI-R 19 inch' })
  @IsOptional()
  @IsString()
  wheels?: string;

  @ApiPropertyOptional({ example: -2.5 })
  @IsOptional()
  @IsNumber()
  frontCamber?: number;

  @ApiPropertyOptional({ example: -1.8 })
  @IsOptional()
  @IsNumber()
  rearCamber?: number;

  @ApiPropertyOptional({ example: 0.05 })
  @IsOptional()
  @IsNumber()
  frontToe?: number;

  @ApiPropertyOptional({ example: 0.03 })
  @IsOptional()
  @IsNumber()
  rearToe?: number;

  @ApiPropertyOptional({ example: 6.5 })
  @IsOptional()
  @IsNumber()
  frontCaster?: number;

  @ApiPropertyOptional({ example: 'Track stability focused alignment' })
  @IsOptional()
  @IsString()
  alignmentNotes?: string;
}