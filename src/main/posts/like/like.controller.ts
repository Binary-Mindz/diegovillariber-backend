import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { LikeService } from './like.service';
import {
  CreateLikeDto,
  LikesQueryDto,
  PostType,
  UnlikeDto,
} from './dto/create.like.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';

@ApiTags('likes')
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Like a post' })
  @ApiResponse({ status: 201, description: 'Post liked successfully' })
  async createLike(
    @GetUser('userId') userId: string,
    @Body() dto: CreateLikeDto,
  ) {
    return handleRequest(async () => {
      return this.likeService.createLike(userId, dto);
    }, 'Post liked successfully', HttpStatus.CREATED);
  }

  @Delete('unlike')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unlike a post' })
  @ApiResponse({ status: 200, description: 'Like removed successfully' })
  @ApiResponse({ status: 404, description: 'Like not found' })
  async removeLike(
    @GetUser('userId') userId: string,
    @Body() unlikeDto: UnlikeDto,
  ) {
    return handleRequest(async () => {
      return this.likeService.unlike(userId, unlikeDto);
    }, 'Like removed successfully', HttpStatus.OK);
  }


  @Get('post/:postId')
  @ApiOperation({ summary: 'Get all likes for a post' })
  @ApiParam({ name: 'postId', description: 'Post UUID' })
  @ApiResponse({ status: 200, description: 'Likes retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPostLikes(
    @Param('postId') postId: string,
    @Query() queryDto: LikesQueryDto,
  ) {
    const result = await this.likeService.getPostLikes(postId, queryDto);
    return {
      success: true,
      ...result,
    };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all likes by a user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({
    status: 200,
    description: 'User likes retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserLikes(
    @Param('userId') userId: string,
    @Query() queryDto: LikesQueryDto,
  ) {
    const result = await this.likeService.getUserLikes(userId, queryDto);
    return {
      success: true,
      ...result,
    };
  }

  @Get('check/:userId/:postId/:postType')
  @ApiOperation({ summary: 'Check if user liked a post' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiParam({ name: 'postId', description: 'Post UUID' })
  @ApiParam({ name: 'postType', enum: PostType })
  @ApiResponse({ status: 200, description: 'Like status retrieved' })
  async checkIfLiked(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
    @Param('postType') postType: PostType,
  ) {
    const result = await this.likeService.checkIfLiked(
      userId,
      postId,
      postType,
    );
    return {
      success: true,
      data: result,
    };
  }
}
