import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorator/roles.tdecorator';
import { handleRequest } from '@/common/helpers/handle.request';

import { AdminUserManagementService } from './admin-user-management.service';
import { PostModerationQueryDto } from './dto/post-mpderation.query.dto';
import { GetUsersQueryDto } from './dto/get-user-query.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('Admin User Management')
@Controller('admin-user-management')
export class AdminUserManagementController {
  constructor(
    private readonly adminUserManagementService: AdminUserManagementService,
  ) {}

  @Get('overview')
  async getUsersWithStats(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminUserManagementService.getUserGrowthRetentionDashboard(),
      'User overview fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get('all-users')
  async getUsers(
  @Query() query: GetUsersQueryDto,
  @Res({ passthrough: true }) res: Response,
  ) {
     const response = await handleRequest(
     () => this.adminUserManagementService.getUsers(query),
    'Users fetched successfully',
   );

    res.status(response.statusCode);
    return response;
  }

  @Get('moderation')
  @ApiOperation({
    summary: 'List posts for moderation (All/Photo/Video + pagination)',
  })
  async list(
    @Query() query: PostModerationQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminUserManagementService.listPostsForModeration(query),
      'Moderation posts fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a post (moderation action)' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminUserManagementService.deletePost(id),
      'Post deleted successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}