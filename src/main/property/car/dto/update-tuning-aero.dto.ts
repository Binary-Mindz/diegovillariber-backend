import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EcuTune } from 'generated/prisma/enums';

export class UpdateTuningAeroDto {
  @ApiPropertyOptional({ enum: EcuTune, example: EcuTune.Stage_2 })
  @IsOptional()
  @IsEnum(EcuTune)
  ecuTune?: EcuTune;

  @ApiPropertyOptional({ example: 'Carbon splitter + rear wing + diffuser' })
  @IsOptional()
  @IsString()
  aeroDynamics?: string;
}