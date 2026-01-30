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
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsQueryDto } from './dto/comment-query.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  async createComment(
    @GetUser('userId') userId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return handleRequest(
      async () => {
        return this.commentService.createComment(userId, dto);
      },
      'Comment created successfully',
      HttpStatus.CREATED,
    );
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  async updateComment(
    @GetUser('userId') userId: string,
    @Param('id') commentId: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return handleRequest(
      async () => {
        return this.commentService.updateComment(userId, commentId, dto);
      },
      'Comment updated successfully',
      HttpStatus.OK,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id', description: 'Comment UUID' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteComment(
    @GetUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return handleRequest(
      async () => {
        return this.commentService.deleteComment(id, userId);
      },
      'Comment deleted successfully',
      HttpStatus.OK,
    );
  }

  @Get('post/:postId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiParam({ name: 'postId', description: 'Post UUID' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPostComments(
    @Param('postId') postId: string,
    @Query() queryDto: CommentsQueryDto,
  ) {
    return handleRequest(
      async () => {
        return this.commentService.getPostComments(postId, queryDto);
      },
      'Comments retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get('user/:userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all comments by a user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({
    status: 200,
    description: 'User comments retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserComments(
    @Param('userId') userId: string,
    @Query() queryDto: CommentsQueryDto,
  ) {
    return handleRequest(
      async () => {
        return this.commentService.getUserComments(userId, queryDto);
      },
      'User comments retrieved successfully',
      HttpStatus.OK,
    );
  }
}
