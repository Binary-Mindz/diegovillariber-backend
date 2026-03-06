import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
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
  async create(@Body() dto: CreateLegalNoticeDto) {
    return handleRequest(
      () => this.adminLegalNoticeService.create(dto),
      'Legal notice created successfully',
      201,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List legal notices (optional profile filter)' })
  @ApiQuery({ name: 'profileId', required: false })
  async list(@Query('profileId') profileId?: string) {
    return handleRequest(
      () => this.adminLegalNoticeService.list(profileId),
      'Legal notices fetched successfully',
    );
  }

  @Get('car/:carId')
  @ApiOperation({ summary: 'Get legal notices by carId' })
  async getByCar(@Param('carId') carId: string) {
    return handleRequest(
      () => this.adminLegalNoticeService.getByCar(carId),
      'Car legal notices fetched successfully',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single legal notice details' })
  async getOne(@Param('id') id: string) {
    return handleRequest(
      () => this.adminLegalNoticeService.getOne(id),
      'Legal notice fetched successfully',
    );
  }
}