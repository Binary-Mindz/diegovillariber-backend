import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class MarkReadDto {
  @ApiProperty({ example: '9a6efcf0-9b3b-4b37-8d9b-39d5d3c70f22' })
  @IsUUID()
  conversationId: string;

  @ApiProperty({ example: 'b0b7f9ff-6d3b-4ef4-9a5c-2b28c9b1e111' })
  @IsUUID()
  messageId: string;
}