import { Controller, Delete, Get, Header, HttpCode, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorator/roles.tdecorator';
import { AdminEventManagementervice } from './admin-event-service';
import { GetAdminEventsQueryDto } from './dto/get-admin-events.query.dto';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('Admin Event Management')
@Controller('admin-event-management')
export class AdminEventManagementController {
  constructor(private readonly adminEventManagementervice: AdminEventManagementervice) {}
  @Get('events-overview')
  getEventsOverview() {
    return this.adminEventManagementervice.getEventsOverview();
  }

  @Get('all-events')
  getAllEvents(@Query() query: GetAdminEventsQueryDto) {
    return this.adminEventManagementervice.getAllEvents(query);
  }

   // Delete All Pro Driver Events
  @Delete('delete-pro-driver-events')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete all Pro Driver events (admin)' })
  deleteAllProDriverEvents() {
    return this.adminEventManagementervice.deleteAllProDriverEvents();
  }

  // Delete All Creator Events
  @Delete('delete-creator-events')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete all Creator events (admin)' })
  deleteAllCreatorEvents() {
    return this.adminEventManagementervice.deleteAllCreatorEvents();
  }

  // Sync Events to Map
  // @Post('sync-events-to-map')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Sync events to map (admin)' })
  // syncEventsToMap() {
  //   return this.adminEventManagementervice.syncEventsToMap();
  // }

  // @Post('clear-map-cache')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Clear map cache for all users (admin)' })
  // clearMapCache() {
  //   return this.adminEventManagementervice.clearMapCache();
  // }

  // Export Events to CSV
   @Get('export-events-csv')
  @ApiOperation({ summary: 'Export events to CSV (admin)' })
  @Header('Content-Type', 'text/csv; charset=utf-8')
  // filename dynamic হওয়ায় service থেকে fixed নাম দিলেও ok
  // dynamic filename চাইলে @Res fastify reply use করতে হবে (নীচে Option-B দিলাম)
  async exportEventsToCsv(): Promise<string> {
    const { csv } = await this.adminEventManagementervice.exportEventsToCsv();
    return csv;
  }
}