import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorator/roles.tdecorator";
import { AdminAnalyticService } from "./admin-analytic.service";
import { handleRequest } from "@/common/helpers/handle.request";


@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@ApiTags('Admin Analytic')
@Controller('admin-analytic')
export class AdminAnalyticController {
  constructor(private readonly adminAnalyticService: AdminAnalyticService) {}

  @Get('advanced-stats')
  async getAdvancedStats() {
    return handleRequest(
      () => this.adminAnalyticService.getAdvancedStats(),
      "Advanced analytics fetched successfully"
    );
  }

  @Get('challenge-arena')
  async getChallengeStats() {
    return handleRequest(
      () => this.adminAnalyticService.getChallengeStats(),
      "Challenge arena stats fetched successfully"
    );
  }
}