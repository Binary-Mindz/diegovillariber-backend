import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Updated comment content',
    example: 'Edited: Thanks bro! 🙌',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content!: string;
}
