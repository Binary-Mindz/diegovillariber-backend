import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SplitScreenInvitationStatus } from 'generated/prisma/enums';


export class RespondSplitScreenInvitationDto {
  @ApiProperty({
    enum: SplitScreenInvitationStatus,
    example: SplitScreenInvitationStatus.ACCEPTED,
    description: 'Only ACCEPTED or DECLINED should be sent by client',
  })
  @IsEnum(SplitScreenInvitationStatus)
  status: SplitScreenInvitationStatus;
}