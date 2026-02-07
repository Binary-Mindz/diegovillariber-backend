import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHighlightDto {
  @ApiProperty({
    example: 24,
    description: 'Highlight duration in hours (e.g. 24, 48, 72, 168)',
  })
  @IsInt()
  @Min(1)
  durationHours: number;

  @ApiProperty({
    example: 300,
    description: 'Charge amount for selected duration',
  })
  @IsInt()
  @Min(0)
  chargeAmount: number;
}