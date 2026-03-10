import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Preference } from 'generated/prisma/enums';

export enum MotorsportRankingType {
  HEAD2HEAD = 'HEAD2HEAD',
  SPLIT_SCREEN = 'SPLIT_SCREEN',
  RAWSHIFT = 'RAWSHIFT',
  PRESTIGE = 'PRESTIGE',
}

export enum RankingDuration {
  ALL = 'ALL',
  TODAY = 'TODAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}

export class MotorsportRankingQueryDto {
  @ApiPropertyOptional({
    enum: MotorsportRankingType,
    example: MotorsportRankingType.HEAD2HEAD,
  })
  @IsOptional()
  @IsEnum(MotorsportRankingType)
  type?: MotorsportRankingType = MotorsportRankingType.HEAD2HEAD;

  @ApiPropertyOptional({
    enum: RankingDuration,
    example: RankingDuration.ALL,
  })
  @IsOptional()
  @IsEnum(RankingDuration)
  duration?: RankingDuration = RankingDuration.ALL;

  @ApiPropertyOptional({
    enum: Preference,
    example: Preference.CAR,
  })
  @IsOptional()
  @IsEnum(Preference)
  preference?: Preference;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}