import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: '3c1c6c8d-5e6e-4dd8-8e23-9b2f2a50a123' })
  @IsUUID()
  receiverId: string;

  @ApiPropertyOptional({ example: 'Hello! কেমন আছো?' })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  content?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.yoursite.com/chat/img/abc.webp',
    description: 'External or uploaded file URL',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  fileUrl?: string;

  @ApiPropertyOptional({
    example: 'local-1700000000000-1',
    description: 'Client-generated idempotency key',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  clientMsgId?: string;
}