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
  create(@Body() dto: CreateLegalNoticeDto) {
    return this.adminLegalNoticeService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List legal notices (optional profile filter)' })
  @ApiQuery({ name: 'profileId', required: false })
  list(@Query('profileId') profileId?: string) {
    return this.adminLegalNoticeService.list(profileId);
  }

  @Get('car/:carId')
  @ApiOperation({ summary: 'Get legal notices by carId' })
  getByCar(@Param('carId') carId: string) {
    return this.adminLegalNoticeService.getByCar(carId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single legal notice details' })
  getOne(@Param('id') id: string) {
    return this.adminLegalNoticeService.getOne(id);
  }
}