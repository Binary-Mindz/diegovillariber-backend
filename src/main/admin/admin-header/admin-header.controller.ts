import { Roles } from '@/common/decorator/roles.tdecorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { handleRequest } from '@/common/helpers/handle.request';
import { AdminHeaderService } from './admin-header.service';
import { CreateHeaderDto } from './dto/create-header.dto';
import { UpdateHeaderDto } from './dto/update-header.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('Admin Header')
@Controller('admin-headers')
export class AdminHeaderController {
  constructor(private readonly adminHeaderService: AdminHeaderService) {}

  @Post()
  @ApiOperation({ summary: 'Create header' })
  async createHeader(
    @Body() dto: CreateHeaderDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminHeaderService.createHeader(dto),
      'Header created successfully',
      HttpStatus.CREATED,
    );

    res.status(response.statusCode);
    return response;
  }

  @Get()
  @ApiOperation({ summary: 'Get all headers' })
  async getAllHeaders(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      () => this.adminHeaderService.getAllHeaders(),
      'Headers fetched successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get header by id' })
  async getHeaderById(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminHeaderService.getHeaderById(id),
      'Header fetched successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update header' })
  async updateHeader(
    @Param('id') id: string,
    @Body() dto: UpdateHeaderDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminHeaderService.updateHeader(id, dto),
      'Header updated successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete header' })
  async deleteHeader(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.adminHeaderService.deleteHeader(id),
      'Header deleted successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }
}