import {
  Controller,
  Get,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorator/roles.tdecorator';
import { handleRequest } from '@/common/helpers/handle.request';

import { AdminAnalyticService } from './admin-analytic.service';
import { TopContentCreatorQueryDto } from './dto/top-content-creator-query.dto';
import { GetMostEngagedPostsQueryDto } from './dto/get-most-engaged-posts-query.dto';

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

 @Get('top-content-creators')
async getTopCreators(
  @Query() query: TopContentCreatorQueryDto,
  @Res() res: Response,
) {
  const response = await this.adminAnalyticService.getTopContentCreators(query);

  return res.status(response.statusCode).json(response);
}

@Get('most-engaged-posts')
  @ApiOperation({ summary: 'Get most engaged posts ranked by likes and comments' })
  async getMostEngagedPosts(@Query() query: GetMostEngagedPostsQueryDto) {
    return this.adminAnalyticService.getMostEngagedPosts(query);
  }


}