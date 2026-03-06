import {
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
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

import { AdminEventManagementervice } from './admin-event-service';
import { GetAdminEventsQueryDto } from './dto/get-admin-events.query.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('Admin Event Management')
@Controller('admin-event-management')
export class AdminEventManagementController {
  constructor(
    private readonly adminEventManagementervice: AdminEventManagementervice,
  ) {}

  @Get('events-overview')
  async getEventsOverview(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminEventManagementervice.getEventsOverview(),
      'Events overview fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get('all-events')
  async getAllEvents(
    @Query() query: GetAdminEventsQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminEventManagementervice.getAllEvents(query),
      'Events fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  // Delete All Pro Driver Events
  @Delete('delete-pro-driver-events')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete all Pro Driver events (admin)' })
  async deleteAllProDriverEvents(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminEventManagementervice.deleteAllProDriverEvents(),
      'All Pro Driver events deleted successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  // Delete All Creator Events
  @Delete('delete-creator-events')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete all Creator events (admin)' })
  async deleteAllCreatorEvents(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminEventManagementervice.deleteAllCreatorEvents(),
      'All Creator events deleted successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  // Export Events to CSV
  @Get('export-events-csv')
  @ApiOperation({ summary: 'Export events to CSV (admin)' })
  @Header('Content-Type', 'text/csv; charset=utf-8')
  async exportEventsToCsv(): Promise<string> {
    const { csv } = await this.adminEventManagementervice.exportEventsToCsv();
    return csv;
  }
}