import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateHeadToHeadCommentDto {
  @ApiProperty({ example: 'Amazing composition!' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ example: 'uuid-of-submission', description: 'If provided, comment is attached to that submission' })
  @IsOptional()
  @IsString()
  submissionId?: string;
}