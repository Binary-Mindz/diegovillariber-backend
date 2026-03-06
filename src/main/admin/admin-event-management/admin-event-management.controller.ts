import { Controller, Delete, Get, Header, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorator/roles.tdecorator';
import { AdminEventManagementervice } from './admin-event-service';
import { GetAdminEventsQueryDto } from './dto/get-admin-events.query.dto';
import { handleRequest } from '@/common/helpers/handle.request';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('Admin Event Management')
@Controller('admin-event-management')
export class AdminEventManagementController {
  constructor(private readonly adminEventManagementervice: AdminEventManagementervice) {}

  @Get('events-overview')
  async getEventsOverview() {
    return handleRequest(
      () => this.adminEventManagementervice.getEventsOverview(),
      'Events overview fetched successfully',
    );
  }

  @Get('all-events')
  async getAllEvents(@Query() query: GetAdminEventsQueryDto) {
    return handleRequest(
      () => this.adminEventManagementervice.getAllEvents(query),
      'Events fetched successfully',
    );
  }

  // Delete All Pro Driver Events
  @Delete('delete-pro-driver-events')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete all Pro Driver events (admin)' })
  async deleteAllProDriverEvents() {
    return handleRequest(
      () => this.adminEventManagementervice.deleteAllProDriverEvents(),
      'All Pro Driver events deleted successfully',
    );
  }

  // Delete All Creator Events
  @Delete('delete-creator-events')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete all Creator events (admin)' })
  async deleteAllCreatorEvents() {
    return handleRequest(
      () => this.adminEventManagementervice.deleteAllCreatorEvents(),
      'All Creator events deleted successfully',
    );
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