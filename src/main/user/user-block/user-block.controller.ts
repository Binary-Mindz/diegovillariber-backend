import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
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
import { BlockUserDto } from './dto/block-user.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('User Blocks')
@Controller('user-blocks')
export class UserBlockController {
  constructor(private readonly userBlockService: UserBlockService) {}

  @Post()
  @ApiOperation({ summary: 'Block a user' })
  @ApiBody({ type: BlockUserDto })
  async blockUser(
    @GetUser('userId') userId: string,
    @Body() dto: BlockUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () =>
        this.userBlockService.blockUser(userId, dto.targetUserId, dto.reason),
      'User blocked successfully',
    );

    res.status(response.statusCode);
    return response;
  }

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