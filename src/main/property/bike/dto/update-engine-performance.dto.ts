import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateEnginePerformanceDto {
  @ApiProperty({ example: 'Inline-4' })
  @IsString()
  @MaxLength(100)
  engineType: string;

  @ApiPropertyOptional({ example: 998 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displacement?: number;

  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @IsInt()
  @Min(0)
  power?: number;

  @ApiPropertyOptional({ example: 113 })
  @IsOptional()
  @IsInt()
  @Min(0)
  torque?: number;

  @ApiPropertyOptional({ example: 'Woolich Racing Tune' })
  @IsOptional()
  @IsString()
  ecu?: string;
}