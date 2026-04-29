import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class BlockUserDto {
  @ApiProperty({
    example: '0f42f6d0-5773-4a0c-ae48-2a5b8082dcfe',
  })
  @IsUUID()
  targetUserId!: string;

  @ApiPropertyOptional({
    example: 'Spam messages',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}