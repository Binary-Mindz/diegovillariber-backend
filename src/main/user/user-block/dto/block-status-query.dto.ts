import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class BlockStatusQueryDto {
  @ApiProperty({
    example: '0f42f6d0-5773-4a0c-ae48-2a5b8082dcfe',
  })
  @IsUUID()
  targetUserId: string;
}