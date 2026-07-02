import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class HashtagQueryDto {
  @ApiPropertyOptional({
    description: 'Search hashtags by tag name (supports partial match)',
    example: 'lotusexige',
    type: String,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
