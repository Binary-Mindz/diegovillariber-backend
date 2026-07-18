import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { RankingDuration } from '../enums/ranking-duration.enum';

export class TopRatedPostDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: RankingDuration,
    example: RankingDuration.ALL,
    description: 'Time filter duration',
  })
  @IsOptional()
  @IsEnum(RankingDuration)
  duration?: RankingDuration = RankingDuration.ALL;
}
