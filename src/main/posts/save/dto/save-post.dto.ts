import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SavePostDto {
  @ApiProperty({ example: '7e3525f6-a27b-41db-bdaa-e80bd4877af4' })
  @IsUUID()
  postId: string;
}
