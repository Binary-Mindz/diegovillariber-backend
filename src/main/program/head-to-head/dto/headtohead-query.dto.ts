import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { BattleAccessType, BattleMediaType, BattleStatus } from 'generated/prisma/enums';


export enum BattleTab {
  ACTIVE = 'ACTIVE',
  UPCOMING = 'UPCOMING',
  FINISHED = 'FINISHED',
}

export class HeadToHeadQueryDto {
  @ApiPropertyOptional({ enum: BattleTab, example: BattleTab.ACTIVE })
  @IsOptional()
  @IsEnum(BattleTab)
  tab?: BattleTab;

  @ApiPropertyOptional({ enum: BattleStatus, example: BattleStatus.RUNNING })
  @IsOptional()
  @IsEnum(BattleStatus)
  status?: BattleStatus;

  @ApiPropertyOptional({ enum: BattleMediaType, example: BattleMediaType.PHOTO })
  @IsOptional()
  @IsEnum(BattleMediaType)
  mediaType?: BattleMediaType;

  @ApiPropertyOptional({ enum: BattleAccessType, example: BattleAccessType.OPEN })
  @IsOptional()
  @IsEnum(BattleAccessType)
  accessType?: BattleAccessType;

  @ApiPropertyOptional({ example: 'uuid-of-creator' })
  @IsOptional()
  @IsString()
  creatorId?: string;

  @ApiPropertyOptional({ example: 'sunset', description: 'Search by title/description/locationName' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({ example: 0, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}