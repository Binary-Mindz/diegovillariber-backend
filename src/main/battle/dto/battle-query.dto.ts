import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { BattleStatusDto } from './create-battle.dto';

export class BattleQueryDto {
  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: '10' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ enum: BattleStatusDto, example: BattleStatusDto.ACTIVE })
  @IsOptional()
  @IsEnum(BattleStatusDto)
  status?: BattleStatusDto;

  @ApiPropertyOptional({ example: 'supercar' })
  @IsOptional()
  @IsString()
  search?: string;
}
