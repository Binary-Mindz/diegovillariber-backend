import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class EngagementQueryDto {
  @ApiPropertyOptional({
    example: '1',
    description: 'Page number for top performing posts pagination',
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    example: '5',
    description: 'Number of top posts per page',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}