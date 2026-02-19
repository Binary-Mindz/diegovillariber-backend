import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorator/roles.tdecorator";
import { AdminAnalyticService } from "./admin-analytic.service";


@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@ApiTags('Admin Analytic')
@Controller('admin-analytic')
export class AdminAnalyticController {
  constructor(private readonly adminAnalyticService: AdminAnalyticService) { }

  @Get('advanced-stats')
  getAdvancedStats() {
    return this.adminAnalyticService.getAdvancedStats();
  }

  @Get('challenge-arena')
  getChallengeStats() {
    return this.adminAnalyticService.getChallengeStats();
  }
}