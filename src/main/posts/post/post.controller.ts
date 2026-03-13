import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { PostService } from './post.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create.post.dto';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { UpdatePostDto } from './dto/update-post.dto';
import { FeedQueryDto } from './dto/feed-query.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postsService: PostService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      'Create post (earn +5). Optional: contentBooster=true costs -300 (requires totalPoints>=300).',
  })
  async createPost(
    @GetUser('userId') userId: string,
    @Body() dto: CreatePostDto,
  ) {
    return handleRequest(async () => {
      const post = await this.postsService.createPost(userId, dto);
      return post;
    }, 'Post created successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('feed')
async getFeed(
  @GetUser('id') userId: string,
  @Query() query: FeedQueryDto,
  @Res({ passthrough: true }) res: Response,
) {
  const response = await handleRequest(
    () => this.postsService.getFeed(userId, query),
    'Feed fetched successfully',
  );

  res.status(response.statusCode);
  return response;
}
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
 @Get(':postId')
async getSinglePost(
  @GetUser('id') userId: string,
  @Param('postId') postId: string,
  @Res({ passthrough: true }) res: Response,
) {
  const response = await handleRequest(
    () => this.postsService.getSinglePost(userId, postId),
    'Post fetched successfully',
  );

  res.status(response.statusCode);
  return response;
}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update post (only owner can update)' })
  async updatePost(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Body() dto: UpdatePostDto,
  ) {
    return handleRequest(async () => {
      const post = await this.postsService.updatePost(id, userId, dto);
      return post;
    }, 'Post updated successfully');
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete post (only owner can delete)' })
  @ApiResponse({ status: 200 })
  async deletePost(@Param('id') id: string, @GetUser('userId') userId: string) {
    return handleRequest(async () => {
      const result = await this.postsService.deletePost(id, userId);
      return result;
    }, 'Post deleted successfully');
  }
}
