import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Min, Max } from 'class-validator';

export class ListMessagesDto {
  @ApiProperty({ example: '9a6efcf0-9b3b-4b37-8d9b-39d5d3c70f22' })
  @IsUUID()
  conversationId: string;

  @ApiPropertyOptional({ example: 30, default: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 30;

  @ApiPropertyOptional({
    example: 'b0b7f9ff-6d3b-4ef4-9a5c-2b28c9b1e111',
    description: 'Cursor pagination: return messages older than this messageId',
  })
  @IsOptional()
  @IsUUID()
  cursorId?: string;
}