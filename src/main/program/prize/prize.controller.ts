import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { PrizeService } from './prize.service';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { Roles } from '@/common/decorator/roles.tdecorator';
import { Role } from 'generated/prisma/enums';
import { UpdatePrizeDto } from './dto/update.prize.dto';


@ApiTags('Prize')
@Controller('prizes')
export class PrizeController {
  constructor(private readonly service: PrizeService) {}

  @Get()
  @ApiOperation({ summary: 'List prizes' })
  async list() {
    return handleRequest(async () => {
      return this.service.listPrizes();
    }, 'Prize list fetched successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prize details' })
  @ApiResponse({ status: 200 })
  async details(@Param('id') id: string) {
    return handleRequest(async () => {
      return this.service.getPrize(id);
    }, 'Prize fetched successfully');
  }

  // ✅ Admin only
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create prize (Admin only)' })
  async create(@GetUser('userId') adminUserId: string, @Body() dto: CreatePrizeDto) {
    return handleRequest(async () => {
      return this.service.createPrize(adminUserId, dto);
    }, 'Prize created successfully');
  }

  // ✅ Admin only
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update prize (Admin only)' })
  async update(@Param('id') id: string, @Body() dto: UpdatePrizeDto) {
    return handleRequest(async () => {
      return this.service.updatePrize(id, dto);
    }, 'Prize updated successfully');
  }

  // ✅ Admin only
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete prize (Admin only)' })
  async remove(@Param('id') id: string) {
    return handleRequest(async () => {
      return this.service.deletePrize(id);
    }, 'Prize deleted successfully');
  }
}