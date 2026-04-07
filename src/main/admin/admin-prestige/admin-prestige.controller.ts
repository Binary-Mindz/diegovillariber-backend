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
import { Role } from 'generated/prisma/enums';

import { AdminPrestigeService } from './admin-prestige.service';
import { CreatePrestigeDto } from './dto/create-prestige.dto';
import { UpdatePrestigeDto } from './dto/update-prestige.dto';
import { GetPrestigeQueryDto } from './dto/get-prestige-query.dto';
import { ChangePrestigeStatusDto } from './dto/change-prestige-status.dto';
import { PrestigeOverviewQueryDto } from './dto/prestige-overview-query.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.OFFICIAL_PARTNER)
@ApiTags('Prestige Management')
@Controller('admin-prestige')
export class AdminPrestigeController {
  constructor(private readonly prestigeService: AdminPrestigeService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get prestige overview dashboard cards' })
  async getPrestigeOverview(
    @Query() query: PrestigeOverviewQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.prestigeService.getPrestigeOverview(query),
      'Prestige overview fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new prestige rule' })
  async createPrestige(
    @Body() dto: CreatePrestigeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.prestigeService.createPrestige(dto),
      'Prestige rule created successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get()
  @ApiOperation({ summary: 'Get all prestige rules with pagination' })
  async getPrestigeRules(
    @Query() query: GetPrestigeQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.prestigeService.getPrestigeRules(query),
      'Prestige rules fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single prestige rule details' })
  async getSinglePrestige(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.prestigeService.getSinglePrestige(id),
      'Prestige rule fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update prestige rule' })
  async updatePrestige(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePrestigeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.prestigeService.updatePrestige(id, dto),
      'Prestige rule updated successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change prestige rule status' })
  async changePrestigeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangePrestigeStatusDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.prestigeService.changePrestigeStatus(id, dto),
      'Prestige rule status changed successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete prestige rule' })
  async deletePrestige(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.prestigeService.deletePrestige(id),
      'Prestige rule deleted successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}