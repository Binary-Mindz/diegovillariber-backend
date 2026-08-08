import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PostTagRequestStatus } from 'generated/prisma/client';

export class RespondTagRequestDto {
  @ApiProperty({
    enum: [PostTagRequestStatus.ACCEPTED, PostTagRequestStatus.REJECTED],
    example: PostTagRequestStatus.ACCEPTED,

    description: 'Action on tag request: ACCEPTED or REJECTED',
  })
  @IsEnum(PostTagRequestStatus)
  status!: PostTagRequestStatus;
}
