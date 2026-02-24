import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDrivetrainDto {
  @ApiPropertyOptional({ example: 'DCT software + strengthened gears' })
  @IsOptional()
  @IsString()
  transmissionMods?: string;

  @ApiPropertyOptional({ example: 'M Performance LSD' })
  @IsOptional()
  @IsString()
  differential?: string;

  @ApiPropertyOptional({ example: 'Twin-plate clutch kit' })
  @IsOptional()
  @IsString()
  clutch?: string;
}