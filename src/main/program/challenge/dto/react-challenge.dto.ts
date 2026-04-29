import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ReactionType } from 'generated/prisma/enums';

export class ReactChallengeDto {
  @ApiPropertyOptional({ enum: ReactionType, example: ReactionType.LIKE })
  @IsOptional()
  @IsEnum(ReactionType)
  type?: ReactionType;
}