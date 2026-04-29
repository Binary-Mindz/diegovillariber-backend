import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class JoinChallengeDto {
  @ApiPropertyOptional({ example: 'Optional note / reason' })
  @IsOptional()
  @IsString()
  note?: string;
}