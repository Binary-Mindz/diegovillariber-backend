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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';

import { CreateVirtualGarageDto } from './dto/create-virtual-garage.dto';
import { UpdateVirtualGarageDto } from './dto/update-virtual-garage.dto';
import { VirtualGarageQueryDto } from './dto/virtual-garage-query.dto';
import { VirtualGarageService } from './dto/virtual-garage.service';

@ApiTags('VirtualGarage')
@Controller('virtual-garages')
export class VirtualGarageController {
  constructor(private readonly service: VirtualGarageService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create virtual garage car (SIM_RACING_DRIVER only)' })
  create(@GetUser('userId') userId: string, @Body() dto: CreateVirtualGarageDto) {
    return handleRequest(async () => this.service.create(userId, dto), 'Virtual garage created');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List my virtual garage (Active profile only)' })
  list(@GetUser('userId') userId: string, @Query() query: VirtualGarageQueryDto) {
    return handleRequest(async () => this.service.list(userId, query), 'Virtual garage fetched');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my virtual garage car by id' })
  get(@GetUser('userId') userId: string, @Param('id') id: string) {
    return handleRequest(async () => this.service.get(userId, id), 'Virtual garage car fetched');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update virtual garage car (Owner only)' })
  update(@GetUser('userId') userId: string, @Param('id') id: string, @Body() dto: UpdateVirtualGarageDto) {
    return handleRequest(async () => this.service.update(userId, id, dto), 'Virtual garage updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete virtual garage car (Owner only)' })
  delete(@GetUser('userId') userId: string, @Param('id') id: string) {
    return handleRequest(async () => this.service.delete(userId, id), 'Virtual garage deleted');
  }
}