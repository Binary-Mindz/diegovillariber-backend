import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class VoteBattleDto {
  @ApiProperty({ example: 'battleEntryId uuid' })
  @IsUUID('4')
  entryId: string;
}
