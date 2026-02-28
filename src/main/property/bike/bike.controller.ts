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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';


import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';

import { UpdateEnginePerformanceDto } from './dto/update-engine-performance.dto';
import { UpdateBikeDrivetrainDto } from './dto/update-bike-drivetrain.dto';
import { UpdateSuspensionDto } from './dto/update-suspension.dto';
import { UpdateWheelTiresDto } from './dto/update-wheel-tires.dto';
import { UpdateElectronicsDto } from './dto/update-electronics.dto';
import { UpdateBikeUsageNotesDto } from './dto/update-usage-notes.dto';
import { BikeService } from './bike.service';

@ApiTags('Bikes')
@Controller('bikes')
export class BikeController {
  constructor(private readonly bikeService: BikeService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create bike (Garage owner only)' })
  create(@GetUser('userId') userId: string, @Body() dto: CreateBikeDto) {
    return handleRequest(async () => this.bikeService.create(userId, dto), 'Bike created successfully');
  }

  // like your cars controller: /bikes/bikes
  @Get('/bikes')
  getBikes() {
    return handleRequest(async () => this.bikeService.getBikes(), 'Bikes get successfully');
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get bike with advanced data' })
  get(@Param('id') bikeId: string) {
    return handleRequest(async () => this.bikeService.get(bikeId), 'Bike fetched');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update bike (Owner only)' })
  update(@GetUser('userId') userId: string, @Param('id') bikeId: string, @Body() dto: UpdateBikeDto) {
    return handleRequest(async () => this.bikeService.update(userId, bikeId, dto), 'Bike updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete bike (Owner only)' })
  delete(@GetUser('userId') userId: string, @Param('id') bikeId: string) {
    return handleRequest(async () => this.bikeService.delete(userId, bikeId), 'Bike deleted');
  }

  // ✅ Missing POST APIs (Create sections)

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/engine-performance')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create engine & performance section' })
  createEnginePerformance(@GetUser('userId') userId: string, @Param('id') bikeId: string, @Body() dto: UpdateEnginePerformanceDto) {
    return handleRequest(async () => this.bikeService.createEnginePerformance(userId, bikeId, dto), 'Engine & Performance created');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/drive-train')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create drivetrain section' })
  createDrivetrain(@GetUser('userId') userId: string, @Param('id') bikeId: string, @Body() dto: UpdateBikeDrivetrainDto) {
    return handleRequest(async () => this.bikeService.createDrivetrain(userId, bikeId, dto), 'Drivetrain created');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/suspension')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create suspension & brakes section' })
  createSuspension(@GetUser('userId') userId: string, @Param('id') bikeId: string, @Body() dto: UpdateSuspensionDto) {
    return handleRequest(async () => this.bikeService.createSuspension(userId, bikeId, dto), 'Suspension created');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/wheel-tires')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create wheels & tires section' })
  createWheelTires(@GetUser('userId') userId: string, @Param('id') bikeId: string, @Body() dto: UpdateWheelTiresDto) {
    return handleRequest(async () => this.bikeService.createWheelTires(userId, bikeId, dto), 'Wheels & Tires created');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/electronics')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create electronics section' })
  createElectronics(@GetUser('userId') userId: string, @Param('id') bikeId: string, @Body() dto: UpdateElectronicsDto) {
    return handleRequest(async () => this.bikeService.createElectronics(userId, bikeId, dto), 'Electronics created');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/usage-notes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create usage notes section' })
  createUsageNotes(@GetUser('userId') userId: string, @Param('id') bikeId: string, @Body() dto: UpdateBikeUsageNotesDto) {
    return handleRequest(async () => this.bikeService.createUsageNotes(userId, bikeId, dto), 'Usage Notes created');
  }

  // ✅ PATCH APIs (Upsert sections)

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/engine-performance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update engine & performance section' })
  updateEnginePerformance(@GetUser('userId') userId: string, @Param('id') bikeId: string, @Body() dto: UpdateEnginePerformanceDto) {
    return handleRequest(async () => this.bikeService.updateEnginePerformance(userId, bikeId, dto), 'Engine & Performance updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/drive-train')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update drivetrain section' })
  updateDrivetrain(@GetUser('userId') userId: string, @Param('id') bikeId: string, @Body() dto: UpdateBikeDrivetrainDto) {
    return handleRequest(async () => this.bikeService.updateDrivetrain(userId, bikeId, dto), 'Drivetrain updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/suspension')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update suspension & brakes section' })
  updateSuspension(@GetUser('userId') userId: string, @Param('id') bikeId: string, @Body() dto: UpdateSuspensionDto) {
    return handleRequest(async () => this.bikeService.updateSuspension(userId, bikeId, dto), 'Suspension updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/wheel-tires')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update wheels & tires section' })
  updateWheelTires(@GetUser('userId') userId: string, @Param('id') bikeId: string, @Body() dto: UpdateWheelTiresDto) {
    return handleRequest(async () => this.bikeService.updateWheelTires(userId, bikeId, dto), 'Wheels & Tires updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/electronics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update electronics section' })
  updateElectronics(@GetUser('userId') userId: string, @Param('id') bikeId: string, @Body() dto: UpdateElectronicsDto) {
    return handleRequest(async () => this.bikeService.updateElectronics(userId, bikeId, dto), 'Electronics updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/usage-notes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update usage notes section' })
  updateUsageNotes(@GetUser('userId') userId: string, @Param('id') bikeId: string, @Body() dto: UpdateBikeUsageNotesDto) {
    return handleRequest(async () => this.bikeService.updateUsageNotes(userId, bikeId, dto), 'Usage Notes updated');
  }
}