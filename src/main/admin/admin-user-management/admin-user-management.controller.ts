import { Roles } from '@/common/decorator/roles.tdecorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { handleRequest } from '@/common/helpers/handle.request';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Role } from 'generated/prisma/enums';
import { AdminUserManagementService } from './admin-user-management.service';
import { GetUsersQueryDto } from './dto/get-user-query.dto';
import { PostModerationQueryDto } from './dto/post-mpderation.query.dto';
import { ProvideTokenDto } from './dto/provide-token.dto';

@ApiBearerAuth()
@ApiTags('Admin User Management')
@Controller('admin-user-management')
export class AdminUserManagementController {
  constructor(
    private readonly adminUserManagementService: AdminUserManagementService,
  ) {}

  @Post('provide-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async provideToken(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: ProvideTokenDto,
  ) {
    const response = await handleRequest(
      () => this.adminUserManagementService.provideToken(dto),
      'Token provided successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICIAL_PARTNER)
  @Get('overview')
  async getUsersWithStats(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminUserManagementService.getUserGrowthRetentionDashboard(),
      'User overview fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a post (post moderation action)' })
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a user (admin only)' })
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminUserManagementService.deleteUser(id),
      'User deleted successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}
