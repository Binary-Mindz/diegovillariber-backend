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
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorator/roles.tdecorator';
import { handleRequest } from '@/common/helpers/handle.request';

import { AdminEventManagementervice } from './admin-event-service';
import { GetAdminEventsQueryDto } from './dto/get-admin-events.query.dto';
import { EngagementQueryDto } from './dto/engagemant-query.dto';
import { Role } from 'generated/prisma/enums';

@ApiBearerAuth()

@ApiTags('Admin Event Management')
@Controller('admin-event-management')
export class AdminEventManagementController {
  constructor(
    private readonly adminEventManagementervice: AdminEventManagementervice,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('events-overview')
  async getEventsOverview(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminEventManagementervice.getEventsOverview(),
      'Events overview fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }
   
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICIAL_PARTNER)
  @Get('retention-overview')
  @ApiOperation({ summary: 'Get retention overview analytics' })
  async getRetentionOverview(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminEventManagementervice.getRetentionOverview(),
      'Retention overview fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICIAL_PARTNER)
  @Get('retention-cohort')
  @ApiOperation({ summary: 'Get cohort retention analytics' })
  async getCohortRetention(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminEventManagementervice.getCohortRetention(),
      'Cohort retention fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICIAL_PARTNER)
  @Get('retention-churn-health')
  @ApiOperation({ summary: 'Get churn and user health analytics' })
  async getChurnAndHealth(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminEventManagementervice.getChurnAndHealth(),
      'Churn and user health fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICIAL_PARTNER)
  @Get('retention-power-users')
  @ApiOperation({ summary: 'Get power users analytics' })
  async getPowerUsers(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminEventManagementervice.getPowerUsers(),
      'Power users fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICIAL_PARTNER)
  @Get('engagement-overview')
  @ApiOperation({ summary: 'Get engagement overview analytics' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 5 })
  async getEngagementOverview(
    @Query() query: EngagementQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminEventManagementervice.getEngagementOverview(query),
      'Engagement overview fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICIAL_PARTNER)
  @Get('brand-metrics')
  @ApiOperation({ summary: 'Get brand metrics overview' })
  async getBrandMetrics(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminEventManagementervice.getBrandMetricsOverview(),
      'Brand metrics fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICIAL_PARTNER)
  @Get('economy-overview')
  @ApiOperation({ summary: 'Get economy overview analytics' })
  async getEconomyOverview(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminEventManagementervice.getEconomyOverview(),
      'Economy overview fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
  async getSingleEvent(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminEventManagementervice.getSingleEvent(id),
      'Event fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteEvent(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminEventManagementervice.deleteEvent(id),
      'Event deleted successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('export-events-csv')
  @ApiOperation({ summary: 'Export events to CSV (admin)' })
  @Header('Content-Type', 'text/csv; charset=utf-8')
  async exportEventsToCsv(): Promise<string> {
    const { csv } = await this.adminEventManagementervice.exportEventsToCsv();
    return csv;
  }
}