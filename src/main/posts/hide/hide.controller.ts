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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { HideService } from './hide.service';
import { HidePostDto } from './dto/hide-post.dto';
import { UnhidePostDto } from './dto/unhide-post.dto';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('HidePost')
@Controller('hides')
export class HideController {
  constructor(private readonly hideService: HideService) {}

  @ApiOperation({ summary: 'Hide a post' })
  @ApiResponse({ status: 201, description: 'Post hidden successfully' })
  @Post()
  async hidePost(
    @GetUser('userId') userId: string,
    @Body() dto: HidePostDto,
  ) {
    return handleRequest(
      async () => this.hideService.hidePost(userId, dto),
      'Post hidden successfully',
      HttpStatus.CREATED,
    );
  }


  @ApiOperation({ summary: 'Unhide a post' })
  @ApiResponse({ status: 200, description: 'Post unhidden successfully' })
  @Delete()
  async unhidePost(
    @GetUser('userId') userId: string,
    @Body() dto: UnhidePostDto,
  ) {
    return handleRequest(
      async () => this.hideService.unhidePost(userId, dto),
      'Post unhidden successfully',
      HttpStatus.OK,
    );
  }


  @ApiOperation({ summary: 'Get my hidden posts' })
  @ApiResponse({ status: 200 })
  @Get('me')
  async getMyHiddenPosts(@GetUser('userId') userId: string) {
    return handleRequest(
      async () => this.hideService.getMyHiddenPosts(userId),
      'Hidden posts fetched successfully',
      HttpStatus.OK,
    );
  }


  @ApiOperation({ summary: 'Check if post is hidden' })
  @ApiResponse({ status: 200 })
  @Get('check')
  async isPostHidden(
    @GetUser('userId') userId: string,
    @Query('postId') postId: string,
  ) {
    return handleRequest(
      async () => this.hideService.isPostHidden(userId, postId),
      'Hidden status fetched',
      HttpStatus.OK,
    );
  }
}
