import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { RacingVoteTargetType } from './create-racing-vote.dto';

export class RacingVoteHistoryDto {
  @ApiPropertyOptional({
    enum: RacingVoteTargetType,
    example: RacingVoteTargetType.USER,
  })
  @IsOptional()
  @IsEnum(RacingVoteTargetType)
  targetType?: RacingVoteTargetType;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}