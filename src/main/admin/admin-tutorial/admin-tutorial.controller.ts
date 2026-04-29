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
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorator/roles.tdecorator';
import { handleRequest } from '@/common/helpers/handle.request';

import { Role } from 'generated/prisma/enums';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { TutorialQueryDto } from './dto/tutorial-query.dto';
import { AdminTutorialService } from './admin-tutorial.service';

@ApiTags('Admin-Tutorials')
@Controller('tutorials')
export class AdminTutorialController {
  constructor(private readonly tutorialService: AdminTutorialService) {}

  @Get()
  @ApiOperation({ summary: 'Get published tutorials' })
  @ApiResponse({ status: 200 })
  async getAll(
    @Query() query: TutorialQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.tutorialService.getTutorials(query),
      'Tutorials fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single published tutorial' })
  @ApiResponse({ status: 200 })
  async getSingle(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.tutorialService.getTutorialById(id),
      'Tutorial fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create tutorial (ADMIN only)' })
  async create(
    @Body() dto: CreateTutorialDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.tutorialService.createTutorial(dto),
      'Tutorial created successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update tutorial (ADMIN only)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTutorialDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.tutorialService.updateTutorial(id, dto),
      'Tutorial updated successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete tutorial (ADMIN only)' })
  async remove(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.tutorialService.deleteTutorial(id),
      'Tutorial deleted successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}