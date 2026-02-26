import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class VoteHeadToHeadDto {
  @ApiPropertyOptional({ example: 1, description: 'Like vote now, rating later (1..5 maybe)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  value?: number;
}