import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorator/roles.tdecorator';

import { AdminLegalNoticeService } from './legal.notice.service';
import { CreateLegalNoticeDto } from './dto/create-legal-notice.dto';
import { handleRequest } from '@/common/helpers/handle.request';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('Admin Legal Notice')
@Controller('admin-legal-notice')
export class AdminLegalNoticeController {
  constructor(
    private readonly adminLegalNoticeService: AdminLegalNoticeService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create legal notice for any user profile' })
  async create(
    @Body() dto: CreateLegalNoticeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminLegalNoticeService.create(dto),
      'Legal notice created successfully',
      HttpStatus.CREATED,
    );

    res.status(response.statusCode);
    return response;
  }

  @Get()
  @ApiOperation({ summary: 'List legal notices (optional profile filter)' })
  @ApiQuery({ name: 'profileId', required: false })
  async list(
    @Query('profileId') profileId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminLegalNoticeService.list(profileId),
      'Legal notices fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get('car/:carId')
  @ApiOperation({ summary: 'Get legal notices by carId' })
  async getByCar(
    @Param('carId') carId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminLegalNoticeService.getByCar(carId),
      'Car legal notices fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single legal notice details' })
  async getOne(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminLegalNoticeService.getOne(id),
      'Legal notice fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}