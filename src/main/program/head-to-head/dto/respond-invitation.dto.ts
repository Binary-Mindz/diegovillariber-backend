import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { InvitationStatus } from 'generated/prisma/enums';



export class RespondInvitationDto {
  @ApiProperty({ enum: [InvitationStatus.ACCEPTED, InvitationStatus.DECLINED], example: InvitationStatus.ACCEPTED })
  @IsEnum(InvitationStatus)
  status!: InvitationStatus;
}