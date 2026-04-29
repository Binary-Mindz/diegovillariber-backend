import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class AdOverviewQueryDto {
  @ApiPropertyOptional({
    example: '30d',
    description: 'Overview range',
    enum: ['7d', '30d', '90d'],
  })
  @IsOptional()
  @IsIn(['7d', '30d', '90d'])
  range?: '7d' | '30d' | '90d';
}