import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { UserBlockService } from './user-block.service';
import { BlockStatusQueryDto } from './dto/block-status-query.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('User Blocks')
@Controller('user-blocks')
export class UserBlockController {
  constructor(private readonly userBlockService: UserBlockService) {}

  @Get('my')
  @ApiOperation({ summary: 'Get my blocked users list' })
  async getMyBlockedUsers(
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.userBlockService.getMyBlockedUsers(userId),
      'Blocked users fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get('status')
  @ApiOperation({ summary: 'Check block status with another user' })
  @ApiQuery({ name: 'targetUserId', required: true, type: String })
  async getBlockStatus(
    @GetUser('userId') userId: string,
    @Query() query: BlockStatusQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.userBlockService.getBlockStatus(userId, query.targetUserId),
      'Block status fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Delete(':targetUserId')
  @ApiOperation({ summary: 'Unblock a user' })
  @ApiParam({ name: 'targetUserId', type: String })
  async unblockUser(
    @GetUser('userId') userId: string,
    @Param('targetUserId') targetUserId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.userBlockService.unblockUser(userId, targetUserId),
      'User unblocked successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}