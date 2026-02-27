import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum ChallengeTab {
  ACTIVE = 'ACTIVE', 
  UPCOMING = 'UPCOMING', 
  FINISHED = 'FINISHED', 
  DRAFT = 'DRAFT',
}

export class ChallengeQueryDto {
  @ApiPropertyOptional({ enum: ChallengeTab, example: ChallengeTab.ACTIVE })
  @IsOptional()
  @IsEnum(ChallengeTab)
  tab?: ChallengeTab;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20, maximum: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}