import { 
  Controller, 
  Post, 
  Put, 
  Delete, 
  Get, 
  Body, 
  Param, 
  Query,
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CommentsQueryDto, CreateCommentDto, UpdateCommentDto } from './dto/create.comment.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 404, description: 'User or Post not found' })
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    const comment = await this.commentService.createComment(createCommentDto);
    return {
      success: true,
      message: 'Comment created successfully',
      data: comment
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({ name: 'id', description: 'Comment UUID' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto & { userId: string }
  ) {
    const { userId, ...updateData } = updateCommentDto;
    const comment = await this.commentService.updateComment(id, userId, updateData);
    return {
      success: true,
      message: 'Comment updated successfully',
      data: comment
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id', description: 'Comment UUID' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteComment(
    @Param('id') id: string,
    @Body('userId') userId: string
  ) {
    const result = await this.commentService.deleteComment(id, userId);
    return {
      success: true,
      ...result
    };
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiParam({ name: 'postId', description: 'Post UUID' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPostComments(
    @Param('postId') postId: string,
    @Query() queryDto: CommentsQueryDto
  ) {
    const result = await this.commentService.getPostComments(postId, queryDto);
    return {
      success: true,
      ...result
    };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all comments by a user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User comments retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserComments(
    @Param('userId') userId: string,
    @Query() queryDto: CommentsQueryDto
  ) {
    const result = await this.commentService.getUserComments(userId, queryDto);
    return {
      success: true,
      ...result
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment UUID' })
  @ApiResponse({ status: 200, description: 'Comment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async getCommentById(@Param('id') id: string) {
    const comment = await this.commentService.getCommentById(id);
    return {
      success: true,
      data: comment
    };
  }
}