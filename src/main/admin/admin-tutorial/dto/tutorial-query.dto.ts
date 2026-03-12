import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumberString, IsOptional, IsString, Min } from 'class-validator';

export class TutorialQueryDto {
  @ApiPropertyOptional({
    example: '1',
    description: 'Page number',
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    example: '10',
    description: 'Items per page',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    example: 'feed',
    description: 'Filter by section code',
  })
  @IsOptional()
  @IsString()
  sectionCode?: string;

  @ApiPropertyOptional({
    example: '10',
    description: 'Filter by learn version',
  })
  @IsOptional()
  @IsNumberString()
  learnVersion?: string;

  @ApiPropertyOptional({
    example: 'post',
    description: 'Search by title',
  })
  @IsOptional()
  @IsString()
  search?: string;
}