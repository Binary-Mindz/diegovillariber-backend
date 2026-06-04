import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorator/roles.tdecorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { AdminReportService } from './admin-report.service';
import { AdminReportQueryDto } from './dto/admin-report.query.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('Admin Report')
@Controller('admin-report')
export class AdminReportController {
  constructor(private readonly adminReportService: AdminReportService) {}

  @Get()
  @ApiOperation({ summary: 'Get reports with filtering and pagination' })
  async getReports(
    @Query() query: AdminReportQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminReportService.getReports(query),
      'Reports fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  
  @Patch(':targetId/restore-feed')
  @ApiOperation({ summary: 'Admin: Restore copyright hidden post back to feed' })
  @ApiParam({ name: 'targetId', type: String, example: 'c6f12d7d-98f1-4a18-a2f7-fbb2d2cc1111' })
  async restorePostToFeed(
    @Param('targetId', ParseUUIDPipe) targetId: string, 
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminReportService.resolveCopyrightPost(targetId),
      'Post has been successfully restored to the feed',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single report by id' })
  @ApiParam({ name: 'id', type: String, example: 'c6f12d7d-98f1-4a18-a2f7-fbb2d2cc1111' })
  async getSingleReport(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminReportService.getSingleReport(id),
      'Report fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete report by id' })
  @ApiParam({ name: 'id', type: String, example: 'c6f12d7d-98f1-4a18-a2f7-fbb2d2cc1111' })
  async deleteReport(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminReportService.deleteReport(id),
      'Report deleted successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}