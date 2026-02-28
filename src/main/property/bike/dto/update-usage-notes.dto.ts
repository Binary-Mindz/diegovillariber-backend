import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateBikeUsageNotesDto {
  @ApiPropertyOptional({ example: 195 })
  @IsOptional()
  @IsInt()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ example: 'Trackday' })
  @IsOptional()
  @IsString()
  primaryUsage?: string;

  @ApiPropertyOptional({ example: 'Intermediate' })
  @IsOptional()
  @IsString()
  ridingLevel?: string;

  @ApiPropertyOptional({ example: 'Completed' })
  @IsOptional()
  @IsString()
  buildStatus?: string;

  @ApiPropertyOptional({ example: 'Needs new chain soon' })
  @IsOptional()
  @IsString()
  notes?: string;
}