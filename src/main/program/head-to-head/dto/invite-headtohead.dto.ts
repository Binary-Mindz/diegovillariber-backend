import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InviteHeadToHeadDto {
  @ApiProperty({ example: 'uuid-of-invitee-user' })
  @IsString()
  inviteeId!: string;
}