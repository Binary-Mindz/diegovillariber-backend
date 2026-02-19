import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorator/roles.tdecorator";
import { AdminOverviewService } from "./admin-overview.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@ApiTags('Admin Overview')
@Controller('admin-overview')
export class AdminOverviewController {
  constructor(private readonly adminOverviewService: AdminOverviewService) {}

  @Get('stats')
  getStats() {
    return this.adminOverviewService.getDashboardStats();
  }

  @Get('weekly')
  getWeekly() {
    return this.adminOverviewService.getWeeklyEngagement();
  }
}
