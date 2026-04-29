import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SplitScreenVoteType } from 'generated/prisma/enums';

export class VoteSplitScreenBattleDto {
  @ApiProperty({
    enum: SplitScreenVoteType,
    example: SplitScreenVoteType.RIGHT,
  })
  @IsEnum(SplitScreenVoteType)
  vote!: SplitScreenVoteType;
}