import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class VoteChallengeDto {
  @ApiPropertyOptional({ example: 1, description: 'Vote weight (default 1)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  weight?: number;
}