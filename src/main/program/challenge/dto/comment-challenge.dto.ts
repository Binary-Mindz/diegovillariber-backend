import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateChallengeCommentDto {
  @ApiProperty({ example: 'Awesome shot!' })
  @IsString()
  text: string;

  @ApiPropertyOptional({ example: 'uuid-of-submission', description: 'If comment is for a submission' })
  @IsOptional()
  @IsString()
  submissionId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-parent-comment', description: 'If reply' })
  @IsOptional()
  @IsString()
  parentId?: string;
}