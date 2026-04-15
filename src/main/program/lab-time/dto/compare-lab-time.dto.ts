import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CompareLabTimeDto {
  @ApiProperty({
    example: '11111111-1111-1111-1111-111111111111',
    description: 'Leaderboard/ranking lab time id',
  })
  @IsUUID()
  rankingLabTimeId!: string;

  @ApiProperty({
    example: '22222222-2222-2222-2222-222222222222',
    description: 'My lab time id',
  })
  @IsUUID()
  myLabTimeId!: string;
}