import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  constructor(private readonly postsService: PostService) { }

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


 @Get('feed')
@ApiOperation({ summary: 'Get feed with search, filters, sorting and pagination' })
async feed(@Query() query: FeedQueryDto ){
  return this.postsService.getFeed(query);
}


  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get single post by id' })
  @ApiResponse({ status: 200 })
  async getSinglePost(@Param('id') id: string) {
    return handleRequest(async () => {
      const post = await this.postsService.getSinglePost(id);
      return post;
    }, 'Post fetched successfully');
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
  async deletePost(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
  ) {
    return handleRequest(async () => {
      const result = await this.postsService.deletePost(id, userId);
      return result;
    }, 'Post deleted successfully');
  }

}
