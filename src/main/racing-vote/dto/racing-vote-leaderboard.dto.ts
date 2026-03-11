import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class RacingVoteLeaderboardDto {
  @ApiPropertyOptional({
    example: '10',
    description: 'How many top users to return',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}