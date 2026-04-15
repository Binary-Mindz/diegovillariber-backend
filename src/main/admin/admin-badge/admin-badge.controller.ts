import {
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { handleRequest } from '@/common/helpers/handle.request';
import { AdminBadgeService } from './admin-badge.service';
import { BadgeCatalogQueryDto } from './dto/badge-catalog-query.dto';


@ApiTags('Admin-Badges')
@Controller('admin/badges')
export class AdminBadgeController {
  constructor(private readonly badgeService: AdminBadgeService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get badge dashboard summary' })
  @ApiResponse({ status: 200 })
  async getDashboard(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.badgeService.getDashboard(),
      'Badge dashboard fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get('catalog')
  @ApiOperation({ summary: 'Get badge catalog list' })
  @ApiResponse({ status: 200 })
  async getCatalog(
    @Query() query: BadgeCatalogQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.badgeService.getCatalog(query),
      'Badge catalog fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get badge rules list' })
  @ApiResponse({ status: 200 })
  async getRules(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.badgeService.getRules(),
      'Badge rules fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get badge analytics' })
  @ApiResponse({ status: 200 })
  async getAnalytics(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.badgeService.getAnalytics(),
      'Badge analytics fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}