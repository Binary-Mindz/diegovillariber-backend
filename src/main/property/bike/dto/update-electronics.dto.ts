import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateElectronicsDto {
  @ApiPropertyOptional({ example: 'Track mode' })
  @IsOptional()
  @IsString()
  riding?: string;

  @ApiPropertyOptional({ example: 'TC Level 2' })
  @IsOptional()
  @IsString()
  tractionControl?: string;

  @ApiPropertyOptional({ example: 'Wheelie control off' })
  @IsOptional()
  @IsString()
  wheelieControl?: string;
}