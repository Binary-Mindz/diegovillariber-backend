import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class CreatePostRatingDto {
  @ApiProperty({
    example: 55,
    description: 'Rating score for the post, from 0 to 100',
    minimum: 0,
    maximum: 100,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  score: number;
}