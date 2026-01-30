import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class HidePostDto {
  @ApiProperty({ example: 'uuid-of-post' })
  @IsUUID()
  postId: string;
}
