import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { UpdateEnginePowerDto } from './dto/update-engine-power.dto';
import { UpdateDrivetrainDto } from './dto/update-drivetrain.dto';
import { UpdateChassisBrakesDto } from './dto/update-chassis-break.dto';
import { UpdateTuningAeroDto } from './dto/update-tuning-aero.dto';
import { UpdateInteriorSafetyDto } from './dto/update-interior-safety.dto';
import { UpdateUsageNotesDto } from './dto/update-usage-notes.dto';
import { UpdateWheelsTiresDto } from './dto/update-wheels-tires.dto';

@ApiTags('Cars')
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create car (Garage owner only)' })
  create(
    @GetUser('userId') userId: string,
    @Body() dto: CreateCarDto,
  ) {
    return handleRequest(async () => {
      return this.carService.create(userId, dto);
    }, 'Car created successfully');
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get car with advanced data' })
  get(@Param('id') carId: string) {
    return handleRequest(async () => {
      return this.carService.get(carId);
    }, 'Car fetched');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update car (Owner only)' })
  update(
    @GetUser('userId') userId: string,
    @Param('id') carId: string,
    @Body() dto: UpdateCarDto,
  ) {
    return handleRequest(async () => {
      return this.carService.update(userId, carId, dto);
    }, 'Car updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete car (Owner only)' })
  delete(
    @GetUser('userId') userId: string,
    @Param('id') carId: string,
  ) {
    return handleRequest(async () => {
      return this.carService.delete(userId, carId);
    }, 'Car deleted');
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/engine-power')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update engine & power section' })
  updateEnginePower(
    @GetUser('userId') userId: string,
    @Param('id') carId: string,
    @Body() dto: UpdateEnginePowerDto,
  ) {
    return handleRequest(async () => {
      return this.carService.updateEnginePower(userId, carId, dto);
    }, 'Engine & Power updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/drivetrain')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update drivetrain section' })
  updateDrivetrain(
    @GetUser('userId') userId: string,
    @Param('id') carId: string,
    @Body() dto: UpdateDrivetrainDto,
  ) {
    return handleRequest(async () => {
      return this.carService.updateDrivetrain(userId, carId, dto);
    }, 'Drivetrain updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/chassis-brakes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update chassis & brakes section' })
  updateChassisBrakes(
    @GetUser('userId') userId: string,
    @Param('id') carId: string,
    @Body() dto: UpdateChassisBrakesDto,
  ) {
    return handleRequest(async () => {
      return this.carService.updateChassisBrakes(userId, carId, dto);
    }, 'Chassis & Brakes updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/tuning-aero')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update tuning & aero section' })
  updateTuningAero(
    @GetUser('userId') userId: string,
    @Param('id') carId: string,
    @Body() dto: UpdateTuningAeroDto,
  ) {
    return handleRequest(async () => {
      return this.carService.updateTuningAero(userId, carId, dto);
    }, 'Tuning & Aero updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/interior-safety')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update interior & safety section' })
  updateInteriorSafety(
    @GetUser('userId') userId: string,
    @Param('id') carId: string,
    @Body() dto: UpdateInteriorSafetyDto,
  ) {
    return handleRequest(async () => {
      return this.carService.updateInteriorSafety(userId, carId, dto);
    }, 'Interior & Safety updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/usage-notes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update usage notes section' })
  updateUsageNotes(
    @GetUser('userId') userId: string,
    @Param('id') carId: string,
    @Body() dto: UpdateUsageNotesDto,
  ) {
    return handleRequest(async () => {
      return this.carService.updateUsageNotes(userId, carId, dto);
    }, 'Usage Notes updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/wheels-tires')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update wheels & tires section' })
  updateWheelsTires(
    @GetUser('userId') userId: string,
    @Param('id') carId: string,
    @Body() dto: UpdateWheelsTiresDto,
  ) {
    return handleRequest(async () => {
      return this.carService.updateWheelsTires(userId, carId, dto);
    }, 'Wheels & Tires updated');
  }
}
