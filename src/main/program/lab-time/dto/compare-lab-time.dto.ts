import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

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

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  telemetryLimit?: number = 5;
}
