import {
  Controller,
  Get,
  UseGuards,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorator/roles.tdecorator";
import { AdminOverviewService } from "./admin-overview.service";
import { handleRequest } from "@/common/helpers/handle.request";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@ApiTags("Admin Overview")
@Controller("admin-overview")
export class AdminOverviewController {
  constructor(private readonly adminOverviewService: AdminOverviewService) {}

  @Get("stats")
  async getStats(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminOverviewService.getDashboardStats(),
      "Dashboard stats fetched successfully"
    );

    res.status(response.statusCode);
    return response;
  }

  @Get("weekly")
  async getWeekly(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminOverviewService.getWeeklyEngagement(),
      "Weekly engagement fetched successfully"
    );

    res.status(response.statusCode);
    return response;
  }
}