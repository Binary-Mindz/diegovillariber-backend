import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class VoteRawShiftDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Vote value. Keep 1 for like-vote. Can support 1..5 later.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  value?: number = 1;
}