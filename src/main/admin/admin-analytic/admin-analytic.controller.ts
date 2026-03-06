import {
  Controller,
  Get,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorator/roles.tdecorator';
import { handleRequest } from '@/common/helpers/handle.request';

import { AdminAnalyticService } from './admin-analytic.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('Admin Analytic')
@Controller('admin-analytic')
export class AdminAnalyticController {
  constructor(private readonly adminAnalyticService: AdminAnalyticService) {}

  @Get('advanced-stats')
  async getAdvancedStats(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminAnalyticService.getAdvancedStats(),
      'Advanced analytics fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get('challenge-arena')
  async getChallengeStats(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminAnalyticService.getChallengeStats(),
      'Challenge arena stats fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}