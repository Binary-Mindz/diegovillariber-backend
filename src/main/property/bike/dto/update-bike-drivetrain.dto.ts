import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBikeDrivetrainDto {
  @ApiPropertyOptional({ example: 'Quickshifter + sprocket change' })
  @IsOptional()
  @IsString()
  transmissionMods?: string;

  @ApiPropertyOptional({ example: 'N/A' })
  @IsOptional()
  @IsString()
  differential?: string;

  @ApiPropertyOptional({ example: 'Upgraded clutch plates' })
  @IsOptional()
  @IsString()
  clutch?: string;
}