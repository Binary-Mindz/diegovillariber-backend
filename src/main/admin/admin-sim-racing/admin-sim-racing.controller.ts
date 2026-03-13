import { Roles } from "@/common/decorator/roles.tdecorator";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Controller, Get, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminSimRacingService } from "./admin-sim-racing.service";
import { handleRequest } from "@/common/helpers/handle.request";
import { Response } from 'express';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('Admin Sim Racing')
@Controller('admin-sim-racing')
export class AdminSimRacingController {
   constructor(private readonly adminEventService: AdminSimRacingService) {}

  @Get('sim-racing-statistics')
  @ApiOperation({ summary: 'Get sim racing statistics overview' })
  async getSimRacingStatistics(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminEventService.getSimRacingStatistics(),
      'Sim racing statistics fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get('popular-sims')
  @ApiOperation({ summary: 'Get popular sims analytics' })
  async getPopularSims(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminEventService.getPopularSims(),
      'Popular sims fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}