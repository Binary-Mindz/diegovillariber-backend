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

import { LabTimeService } from './lab-time.service';
import { CreateLabTimeDto } from './dto/create-lab-time.dto';
import { UpdateLabTimeDto } from './dto/update-lab-time.dto';
import { LabTimeQueryDto } from './dto/lab-time-query.dto';
import { CompareLabTimeDto } from './dto/compare-lab-time.dto';

@ApiTags('LabTime')
@Controller('lab-times')
export class LabTimeController {
  constructor(private readonly service: LabTimeService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('circuits')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get circuits for dropdown' })
  getCircuits() {
    return handleRequest(
      async () => this.service.getCircuits(),
      'Circuits fetched',
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('circuits/:trackName/layouts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get layouts by track name' })
  getCircuitLayouts(@Param('trackName') trackName: string) {
    return handleRequest(
      async () => this.service.getCircuitLayouts(trackName),
      'Circuit layouts fetched',
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create lap time (OWNER / PRO_DRIVER / CONTENT_CREATOR only)',
  })
  create(@GetUser('userId') userId: string, @Body() dto: CreateLabTimeDto) {
    return handleRequest(
      async () => this.service.create(userId, dto),
      'Lap time created',
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my lab times' })
  myLabTimes(
    @GetUser('userId') userId: string,
    @Query() query: LabTimeQueryDto,
  ) {
    return handleRequest(
      async () => this.service.myLabTimes(userId, query),
      'My lap times fetched',
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('compare')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Compare a ranking lap time with my lab time on the same track',
  })
  compare(
    @GetUser('userId') userId: string,
    @Query() query: CompareLabTimeDto,
  ) {
    return handleRequest(
      async () => this.service.compare(userId, query),
      'Lap times compared successfully',
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('following')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get lab times from users I follow' })
  followingLabTimes(
    @GetUser('userId') userId: string,
    @Query() query: LabTimeQueryDto,
  ) {
    return handleRequest(
      async () => this.service.followingLabTimes(userId, query),
      'Following users lap times fetched',
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List of ranking lab time.' })
  list(@GetUser('userId') userId: string, @Query() query: LabTimeQueryDto) {
    return handleRequest(
      async () => this.service.list(userId, query),
      'Lap times fetched',
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get lap time by id' })
  get(@Param('id') id: string) {
    return handleRequest(async () => this.service.get(id), 'Lap time fetched');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update lap time (Owner only)' })
  update(
    @GetUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLabTimeDto,
  ) {
    return handleRequest(
      async () => this.service.update(userId, id, dto),
      'Lap time updated',
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete lap time (Owner only)' })
  delete(@GetUser('userId') userId: string, @Param('id') id: string) {
    return handleRequest(
      async () => this.service.delete(userId, id),
      'Lap time deleted',
    );
  }
}
