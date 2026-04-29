import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Patch,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorator/roles.tdecorator';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';

import { AmbassadorProgramService } from './ambassador-program.service';
import { CreateAmbassadorProgramDto } from './dto/create-ambassador-program.dto';
import { UpdateAmbassadorProgramDto } from './dto/update-ambassador-program.dto';
import { AmbassadorProgramQueryDto } from './dto/ambassador-program-query.dto';
import { UpdateAmbassadorStatusDto } from './dto/update-ambassador-status.dto';

@ApiTags('Ambassador Program')
@Controller('ambassador-program')
export class AmbassadorProgramController {
  constructor(
    private readonly ambassadorProgramService: AmbassadorProgramService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Apply for ambassador program (user)' })
  @ApiResponse({ status: 201, description: 'Application created successfully' })
  async apply(
    @GetUser('userId') userId: string,
    @Body() dto: CreateAmbassadorProgramDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.ambassadorProgramService.apply(userId, dto),
      'Ambassador application submitted successfully',
      HttpStatus.CREATED,
    );

    res.status(response.statusCode);
    return response;
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my application (user)' })
  @ApiResponse({ status: 200, description: 'Application fetched successfully' })
  async myApplication(
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.ambassadorProgramService.getMine(userId),
      'Ambassador application fetched successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }

  @Patch('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update my application (only if PENDING)' })
  @ApiResponse({ status: 200, description: 'Application updated successfully' })
  async updateMine(
    @GetUser('userId') userId: string,
    @Body() dto: UpdateAmbassadorProgramDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.ambassadorProgramService.updateMine(userId, dto),
      'Ambassador application updated successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }

  @Delete('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete my application (user)' })
  @ApiResponse({ status: 200, description: 'Application deleted successfully' })
  async deleteMine(
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.ambassadorProgramService.deleteMine(userId),
      'Ambassador application deleted successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List applications (admin)' })
  @ApiResponse({ status: 200, description: 'Applications fetched successfully' })
  async list(
    @Query() query: AmbassadorProgramQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.ambassadorProgramService.list(query),
      'Ambassador applications fetched successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get application by id (admin)' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Application fetched successfully' })
  async getById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.ambassadorProgramService.getById(id),
      'Ambassador application fetched successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update application status (admin)' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  async updateStatus(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateAmbassadorStatusDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.ambassadorProgramService.updateStatus(id, dto),
      'Ambassador application status updated successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete application (admin)' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Application deleted successfully' })
  async deleteById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.ambassadorProgramService.deleteById(id),
      'Ambassador application deleted successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }
}