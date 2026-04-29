import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { RepostService } from './repost.service';
import { RepostPostDto } from './dto/repost-post.dto';
import { UnrepostPostDto } from './dto/unrepost-post.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Repost')
@Controller('reposts')
export class RepostController {
  constructor(private readonly repostService: RepostService) {}

  @ApiOperation({ summary: 'Repost a post' })
  @ApiResponse({ status: 201, description: 'Post reposted successfully' })
  @Post()
  async repostPost(
    @GetUser('userId') userId: string,
    @Body() dto: RepostPostDto,
  ) {
    return handleRequest(
      async () => this.repostService.repostPost(userId, dto),
      'Post reposted successfully',
      HttpStatus.CREATED,
    );
  }

  @ApiOperation({ summary: 'Remove repost from a post' })
  @ApiResponse({ status: 200, description: 'Repost removed successfully' })
  @Delete()
  async unrepostPost(
    @GetUser('userId') userId: string,
    @Body() dto: UnrepostPostDto,
  ) {
    return handleRequest(
      async () => this.repostService.unrepostPost(userId, dto),
      'Repost removed successfully',
      HttpStatus.OK,
    );
  }

  @ApiOperation({ summary: 'Get my reposted posts' })
  @ApiResponse({ status: 200, description: 'Reposted posts fetched successfully' })
  @Get('me')
  async getMyReposts(@GetUser('userId') userId: string) {
    return handleRequest(
      async () => this.repostService.getMyReposts(userId),
      'Reposted posts fetched successfully',
      HttpStatus.OK,
    );
  }

  @ApiOperation({ summary: 'Check if post is reposted by me' })
  @ApiResponse({ status: 200, description: 'Repost status fetched successfully' })
  @Get('check')
  async isPostReposted(
    @GetUser('userId') userId: string,
    @Query('postId') postId: string,
  ) {
    return handleRequest(
      async () => this.repostService.isPostReposted(userId, postId),
      'Repost status fetched successfully',
      HttpStatus.OK,
    );
  }
}