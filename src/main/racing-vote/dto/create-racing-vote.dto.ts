import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID, ValidateIf } from 'class-validator';

export enum RacingVoteTargetType {
  USER = 'USER',
  POST = 'POST',
}

export class CreateRacingVoteDto {
  @ApiProperty({ enum: RacingVoteTargetType, example: RacingVoteTargetType.USER })
  @IsEnum(RacingVoteTargetType)
  targetType!: RacingVoteTargetType;

  @ApiProperty({ required: false, example: '2b4f6c9a-9c9a-4c8b-b7c0-1cc0a1111111' })
  @ValidateIf((o) => o.targetType === RacingVoteTargetType.USER)
  @IsUUID()
  targetUserId?: string;

  @ApiProperty({ required: false, example: '88dce39a-3f29-4f71-8fb5-2f4db2222222' })
  @ValidateIf((o) => o.targetType === RacingVoteTargetType.POST)
  @IsUUID()
  postId?: string;
}