import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Preference } from 'generated/prisma/enums';
import { RankingDuration } from '../enums/ranking-duration.enum';
import { MotorsportRankingType } from '../enums/ranking-types.enums';

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
