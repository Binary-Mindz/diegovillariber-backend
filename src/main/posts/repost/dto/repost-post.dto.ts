import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RepostPostDto {
  @ApiProperty({
    example: '2b7d6b91-8a61-4d9b-a2d0-7f24b0e8e1a1',
    description: 'Post ID to repost',
  })
  @IsUUID()
  postId!: string;
}