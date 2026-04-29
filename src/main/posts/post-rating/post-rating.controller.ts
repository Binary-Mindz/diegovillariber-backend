import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { PostRatingService } from './post-rating.service';
import { CreatePostRatingDto } from './dto/create-post-rating.dto';

@ApiTags('Post Ratings')
@Controller('posts')
export class PostRatingController {
  constructor(private readonly postRatingService: PostRatingService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Rate a post once (one user can rate one post only once)',
  })
  @ApiParam({
    name: 'postId',
    example: '0c550a0d-0a8f-4df8-bf58-36c6a6f5a671',
  })
  @Post(':postId/rate')
  async ratePost(
    @GetUser('userId') userId: string,
    @Param('postId') postId: string,
    @Body() dto: CreatePostRatingDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.postRatingService.ratePost(userId, postId, dto),
      'Post rated successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiOperation({ summary: 'Get rating summary of a post' })
  @ApiParam({
    name: 'postId',
    example: '0c550a0d-0a8f-4df8-bf58-36c6a6f5a671',
  })
  @Get(':postId/rate-summary')
  async getPostRatingSummary(
    @Param('postId') postId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.postRatingService.getPostRatingSummary(postId),
      'Post rating summary fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get rating summary of a post with my rating' })
  @ApiParam({
    name: 'postId',
    example: '0c550a0d-0a8f-4df8-bf58-36c6a6f5a671',
  })
  @Get(':postId/my-rate-summary')
  async getMyPostRatingSummary(
    @GetUser('userId') userId: string,
    @Param('postId') postId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.postRatingService.getPostRatingSummary(postId, userId),
      'My post rating summary fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove my rating from a post' })
  @ApiParam({
    name: 'postId',
    example: '0c550a0d-0a8f-4df8-bf58-36c6a6f5a671',
  })
  @Delete(':postId/rate')
  async removeMyRating(
    @GetUser('userId') userId: string,
    @Param('postId') postId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.postRatingService.removeMyRating(userId, postId),
      'Post rating removed successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}
