import { 
  Controller, 
  Post as HttpPost, 
  Get, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto, PostQueryDto, UpdatePostDto } from './dto/create.post.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @HttpPost()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async createPost(@Body() createPostDto: CreatePostDto) {
    const post = await this.postService.createPost(createPostDto);
    return {
      success: true,
      message: 'Post created successfully',
      data: post
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  async getPosts(@Query() queryDto: PostQueryDto) {
    const result = await this.postService.getPosts(queryDto);
    return {
      success: true,
      ...result
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiParam({ name: 'id', description: 'Post UUID' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPostById(@Param('id') id: string) {
    const post = await this.postService.getPostById(id);
    return {
      success: true,
      data: post
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update post' })
  @ApiParam({ name: 'id', description: 'Post UUID' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto & { userId: string }
  ) {
    const { userId, ...updateData } = updatePostDto;
    const post = await this.postService.updatePost(id, userId, updateData);
    return {
      success: true,
      message: 'Post updated successfully',
      data: post
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete post' })
  @ApiParam({ name: 'id', description: 'Post UUID' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deletePost(
    @Param('id') id: string,
    @Body('userId') userId: string
  ) {
    const result = await this.postService.deletePost(id, userId);
    return {
      success: true,
      ...result
    };
  }

  @HttpPost(':id/like')
  @ApiOperation({ summary: 'Increment post like count' })
  @ApiParam({ name: 'id', description: 'Post UUID' })
  @ApiResponse({ status: 200, description: 'Like count incremented' })
  async incrementLike(@Param('id') id: string) {
    const post = await this.postService.incrementLike(id);
    return {
      success: true,
      message: 'Like count incremented',
      data: { like: post.like }
    };
  }

  @HttpPost(':id/comment')
  @ApiOperation({ summary: 'Increment post comment count' })
  @ApiParam({ name: 'id', description: 'Post UUID' })
  @ApiResponse({ status: 200, description: 'Comment count incremented' })
  async incrementComment(@Param('id') id: string) {
    const post = await this.postService.incrementComment(id);
    return {
      success: true,
      message: 'Comment count incremented',
      data: { comment: post.comment }
    };
  }

  @HttpPost(':id/share')
  @ApiOperation({ summary: 'Increment post share count' })
  @ApiParam({ name: 'id', description: 'Post UUID' })
  @ApiResponse({ status: 200, description: 'Share count incremented' })
  async incrementShare(@Param('id') id: string) {
    const post = await this.postService.incrementShare(id);
    return {
      success: true,
      message: 'Share count incremented',
      data: { share: post.share }
    };
  }
}