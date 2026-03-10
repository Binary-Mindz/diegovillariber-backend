import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class VoteSplitScreenDto {
  @ApiPropertyOptional({ example: 'Optional for future expansion' })
  @IsOptional()
  reaction?: string;
}