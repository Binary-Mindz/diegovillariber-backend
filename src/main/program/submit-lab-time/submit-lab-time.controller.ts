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

import { SubmitLabTimeService } from './submit-lab-time.service';
import { CreateSubmitLabTimeDto } from './dto/create-submit-lab-time.dto';
import { UpdateSubmitLabTimeDto } from './dto/update-submit-lab-time.dto';
import { SubmitLabTimeQueryDto } from './dto/submit-lab-time-query.dto';

@ApiTags('SubmitLabTime')
@Controller('submit-lab-times')
export class SubmitLabTimeController {
  constructor(private readonly service: SubmitLabTimeService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit lap time (SIM_RACING_DRIVER only)' })
  create(@GetUser('userId') userId: string, @Body() dto: CreateSubmitLabTimeDto) {
    return handleRequest(async () => this.service.create(userId, dto), 'Lap submitted successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List my submitted lap times (Active profile only)' })
  list(@GetUser('userId') userId: string, @Query() query: SubmitLabTimeQueryDto) {
    return handleRequest(async () => this.service.list(userId, query), 'Submitted laps fetched');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my submitted lap by id' })
  get(@GetUser('userId') userId: string, @Param('id') id: string) {
    return handleRequest(async () => this.service.get(userId, id), 'Submitted lap fetched');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update submitted lap (Owner only)' })
  update(@GetUser('userId') userId: string, @Param('id') id: string, @Body() dto: UpdateSubmitLabTimeDto) {
    return handleRequest(async () => this.service.update(userId, id, dto), 'Submitted lap updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete submitted lap (Owner only)' })
  delete(@GetUser('userId') userId: string, @Param('id') id: string) {
    return handleRequest(async () => this.service.delete(userId, id), 'Submitted lap deleted');
  }
}