import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateSplitScreenCommentDto {
  @ApiProperty({ example: 'Clean angle and better lighting.' })
  @IsString()
  @MaxLength(500)
  content: string;

  @ApiPropertyOptional({ example: '9e565f54-05ca-4c46-8f46-14585ea3c2c1' })
  @IsOptional()
  @IsUUID()
  submissionId?: string;
}