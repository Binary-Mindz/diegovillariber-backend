import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorator/roles.tdecorator';
import { handleRequest } from '@/common/helpers/handle.request';


import { CreateAdDto } from './dto/create-ad.dto';
import { GetAdsQueryDto } from './dto/get-ad-query.dto';
import { ChangeAdStatusDto } from './dto/change-ad-status.dto';
import { AdminAdService } from './admin-ad.service';
import { AdOverviewQueryDto } from './dto/ad-overview-query.dto';
import { Role } from 'generated/prisma/enums';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.OFFICIAL_PARTNER)
@ApiTags('Ads Management')
@Controller('admin-ads')
export class AdminAdController {
  constructor(private readonly adService: AdminAdService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get ads overview dashboard cards' })
  async getAdsOverview(
    @Query() query: AdOverviewQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adService.getAdsOverview(query),
      'Ads overview fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new ad' })
  async createAd(
    @Body() dto: CreateAdDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adService.createAd(dto),
      'Ad created successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get()
  @ApiOperation({ summary: 'Get all ads with pagination' })
  async getAds(
    @Query() query: GetAdsQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adService.getAds(query),
      'Ads fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single ad details' })
  async getSingleAd(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adService.getSingleAd(id),
      'Ad fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change ad status' })
  async changeAdStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeAdStatusDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adService.changeAdStatus(id, dto),
      'Ad status changed successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an ad' })
  async deleteAd(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adService.deleteAd(id),
      'Ad deleted successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}