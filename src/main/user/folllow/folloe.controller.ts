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
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { FollowService } from './follow.service';
import { CreateFollowDto, FollowersQueryDto, UnfollowDto } from './dto/create.follow.dto';
import { JwtAuthGuard } from '@/main/auth/guards/jwt-auth.guard';
import { GetUser } from '@/main/auth/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('follows')
@Controller('follows')
export class FollowController {
  constructor(private readonly followService: FollowService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Logged user follow a user' })
  async followUser(
    @GetUser('id') followerId: string,
    @Body() dto: CreateFollowDto,
  ) {
    return handleRequest(
      async () => {
        const follow = await this.followService.followUser(followerId, dto); return follow
      }, 'User Followed successfully',
    );
  }

  @Delete('unfollow')
  @ApiOperation({ summary: 'Logged user unfollow a user' })
  async unfollowUser(@GetUser('id') userId: string, @Body() dto: UnfollowDto) {
    return handleRequest(
      async () => await this.followService.unfollowUser(userId, dto), 'User Unfollowed successfully',
    );
  }

  @Get('myFollowers')
  @ApiOperation({ summary: 'Get My followers' })
  async getMyFollowers(
    @GetUser('id') userId: string,
  ) {
    return handleRequest(
      async () => {
        const result = await this.followService.getMyFollowers(userId);
        return result
      },
      'Get My Followers successfully',
    );
  }

  @Get('mefollowing')
  @ApiOperation({ summary: 'Get me following' })
  async getMeFollowing(
    @GetUser('id') userId: string,
  ) {
    console.log();
    return handleRequest(
      () => this.followService.getMeFollowing(userId),
      'Get Me Following successfully',
    );
  }


  @Get('check/:followerId/:followingId')
  @ApiOperation({ summary: 'Check if a user is following another user' })
  @ApiParam({ name: 'followerId', description: 'Follower User UUID' })
  @ApiParam({ name: 'followingId', description: 'Following User UUID' })
  @ApiResponse({ status: 200, description: 'Follow status retrieved' })
  async isFollowing(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string
  ) {
    const result = await this.followService.isFollowing(followerId, followingId);
    return {
      success: true,
      data: result
    };
  }
  
  @Get('counts/:userId')
  @ApiOperation({ summary: 'Get follower and following counts for a user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Counts retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getFollowCounts(@Param('userId') userId: string) {
    const counts = await this.followService.getFollowCounts(userId);
    return {
      success: true,
      data: counts
    };
  }

  @Get('mutual/:userId/:otherUserId')
  @ApiOperation({ summary: 'Get mutual followers between two users' })
  @ApiParam({ name: 'userId', description: 'First User UUID' })
  @ApiParam({ name: 'otherUserId', description: 'Second User UUID' })
  @ApiResponse({ status: 200, description: 'Mutual followers retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getMutualFollowers(
    @Param('userId') userId: string,
    @Param('otherUserId') otherUserId: string
  ) {
    const result = await this.followService.getMutualFollowers(userId, otherUserId);
    return {
      success: true,
      data: result
    };
  }

}
