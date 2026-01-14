import { 
  Controller, 
  Post, 
  Delete, 
  Get, 
  Body, 
  Param, 
  Query,
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FollowService } from './follow.service';
import { CreateFollowDto, FollowersQueryDto, UnfollowDto } from './dto/create.follow.dto';

@ApiTags('follows')
@Controller('follows')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({ status: 201, description: 'User followed successfully' })
  @ApiResponse({ status: 400, description: 'Cannot follow yourself' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Already following this user' })
  async followUser(@Body() createFollowDto: CreateFollowDto) {
    const follow = await this.followService.followUser(createFollowDto);
    return {
      success: true,
      message: 'User followed successfully',
      data: follow
    };
  }

  @Delete('unfollow')
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiResponse({ status: 200, description: 'User unfollowed successfully' })
  @ApiResponse({ status: 404, description: 'Follow relationship not found' })
  async unfollowUser(@Body() unfollowDto: UnfollowDto) {
    const result = await this.followService.unfollowUser(unfollowDto);
    return {
      success: true,
      ...result
    };
  }

  @Get('followers/:userId')
  @ApiOperation({ summary: 'Get followers of a user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Followers retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getFollowers(
    @Param('userId') userId: string,
    @Query() queryDto: FollowersQueryDto
  ) {
    const result = await this.followService.getFollowers(userId, queryDto);
    return {
      success: true,
      ...result
    };
  }

  @Get('following/:userId')
  @ApiOperation({ summary: 'Get users that a user is following' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Following retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getFollowing(
    @Param('userId') userId: string,
    @Query() queryDto: FollowersQueryDto
  ) {
    const result = await this.followService.getFollowing(userId, queryDto);
    return {
      success: true,
      ...result
    };
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

  @Delete('remove-follower')
  @ApiOperation({ summary: 'Remove a follower' })
  @ApiResponse({ status: 200, description: 'Follower removed successfully' })
  @ApiResponse({ status: 404, description: 'Follower relationship not found' })
  async removeFollower(@Body() body: { userId: string; followerId: string }) {
    const result = await this.followService.removeFollower(body.userId, body.followerId);
    return {
      success: true,
      ...result
    };
  }
}
