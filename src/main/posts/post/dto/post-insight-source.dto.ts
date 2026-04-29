import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PostViewSource } from 'generated/prisma/client';

export class PostInsightSourceDto {
  @ApiPropertyOptional({
    enum: PostViewSource,
    example: PostViewSource.FEED,
  })
  @IsOptional()
  @IsEnum(PostViewSource)
  source?: PostViewSource;
}