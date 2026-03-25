import { ApiProperty } from '@nestjs/swagger';

export class PostRatingSummaryDto {
  @ApiProperty({
    example: '0c550a0d-0a8f-4df8-bf58-36c6a6f5a671',
  })
  postId: string;

  @ApiProperty({
    example: 7,
    description: 'Total number of ratings on this post',
  })
  ratingCount: number;

  @ApiProperty({
    example: 5,
    description: 'Average rating of this post',
  })
  ratingAverage: number;

  @ApiProperty({
    example: 5,
    nullable: true,
    description: 'Current logged in user rating for this post',
  })
  myRating: number | null;
}