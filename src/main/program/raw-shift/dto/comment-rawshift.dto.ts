import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRawShiftCommentDto {
  @ApiPropertyOptional({
    example: '3b58f1a2-7e3f-4d54-b7a8-1a2b3c4d5e6f',
    description: 'Optional: comment on a specific entry',
  })
  @IsOptional()
  @IsUUID()
  entryId?: string;

  @ApiProperty({ example: 'Nice edit! 🔥', description: 'Comment message' })
  @IsString()
  message: string;
}