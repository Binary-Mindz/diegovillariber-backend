import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class CreatePostRatingDto {
  @ApiProperty({
    example: 5,
    description: 'Rating score for the post, from 0 to 10',
    minimum: 0,
    maximum: 10,
  })
  @IsInt()
  @Min(0)
  @Max(10)
  score!: number;
}