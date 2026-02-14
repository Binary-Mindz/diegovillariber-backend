import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BattleStatus } from 'generated/prisma/enums';

export class UpdateBattleStatusDto {
  @ApiProperty({ enum: BattleStatus })
  @IsEnum(BattleStatus)
  status: BattleStatus;
}