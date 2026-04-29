import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { SplitScreenBattleCategory, SplitScreenBattleStatus, SplitScreenDivision, SplitScreenLeagueCode } from 'generated/prisma/enums';

export class SplitScreenBattleQueryDto {
  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: '10' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    enum: SplitScreenBattleStatus,
    example: SplitScreenBattleStatus.LIVE,
  })
  @IsOptional()
  @IsEnum(SplitScreenBattleStatus)
  status?: SplitScreenBattleStatus;

  @ApiPropertyOptional({
    enum: SplitScreenLeagueCode,
    example: SplitScreenLeagueCode.WORLD,
  })
  @IsOptional()
  @IsEnum(SplitScreenLeagueCode)
  league?: SplitScreenLeagueCode;

  @ApiPropertyOptional({
    enum: SplitScreenDivision,
    example: SplitScreenDivision.D1,
  })
  @IsOptional()
  @IsEnum(SplitScreenDivision)
  division?: SplitScreenDivision;

  @ApiPropertyOptional({
    enum: SplitScreenBattleCategory,
    example: SplitScreenBattleCategory.STYLES,
  })
  @IsOptional()
  @IsEnum(SplitScreenBattleCategory)
  category?: SplitScreenBattleCategory;
}