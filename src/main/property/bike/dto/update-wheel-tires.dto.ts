import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateWheelTiresDto {
  @ApiPropertyOptional({ example: 'Marchesini forged' })
  @IsOptional()
  @IsString()
  wheels?: string;

  @ApiPropertyOptional({ example: 'Pirelli Diablo Supercorsa' })
  @IsOptional()
  @IsString()
  tires?: string;
}