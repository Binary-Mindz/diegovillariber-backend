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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

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
import { GetCarsQueryDto } from './dto/get-car-query.dto';

@ApiTags('Cars')
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create car (Garage owner only)' })
  create(@GetUser('userId') userId: string, @Body() dto: CreateCarDto) {
    return handleRequest(async () => this.carService.create(userId, dto), 'Car created successfully');
  }

@Get('/cars')
@ApiOperation({ summary: 'Get cars with pagination' })
getCars(@Query() query: GetCarsQueryDto) {
  return handleRequest(
    async () => this.carService.getCars(query.page, query.limit),
    'Cars get successfully',
  );
}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get car with advanced data' })
  get(@Param('id') carId: string) {
    return handleRequest(async () => this.carService.get(carId), 'Car fetched');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update car (Owner only)' })
  update(@GetUser('userId') userId: string, @Param('id') carId: string, @Body() dto: UpdateCarDto) {
    return handleRequest(async () => this.carService.update(userId, carId, dto), 'Car updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete car (Owner only)' })
  delete(@GetUser('userId') userId: string, @Param('id') carId: string) {
    return handleRequest(async () => this.carService.delete(userId, carId), 'Car deleted');
  }

  // ✅ Missing POST APIs (Create sections)

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/engine-power')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create engine & power section' })
  createEnginePower(@GetUser('userId') userId: string, @Param('id') carId: string, @Body() dto: UpdateEnginePowerDto) {
    return handleRequest(async () => this.carService.createEnginePower(userId, carId, dto), 'Engine & Power created');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/drivetrain')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create drivetrain section' })
  createDrivetrain(@GetUser('userId') userId: string, @Param('id') carId: string, @Body() dto: UpdateDrivetrainDto) {
    return handleRequest(async () => this.carService.createDrivetrain(userId, carId, dto), 'Drivetrain created');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/chassis-brakes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create chassis & brakes section' })
  createChassisBrakes(@GetUser('userId') userId: string, @Param('id') carId: string, @Body() dto: UpdateChassisBrakesDto) {
    return handleRequest(async () => this.carService.createChassisBrakes(userId, carId, dto), 'Chassis & Brakes created');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/tuning-aero')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create tuning & aero section' })
  createTuningAero(@GetUser('userId') userId: string, @Param('id') carId: string, @Body() dto: UpdateTuningAeroDto) {
    return handleRequest(async () => this.carService.createTuningAero(userId, carId, dto), 'Tuning & Aero created');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/interior-safety')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create interior & safety section' })
  createInteriorSafety(@GetUser('userId') userId: string, @Param('id') carId: string, @Body() dto: UpdateInteriorSafetyDto) {
    return handleRequest(async () => this.carService.createInteriorSafety(userId, carId, dto), 'Interior & Safety created');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/usage-notes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create usage notes section' })
  createUsageNotes(@GetUser('userId') userId: string, @Param('id') carId: string, @Body() dto: UpdateUsageNotesDto) {
    return handleRequest(async () => this.carService.createUsageNotes(userId, carId, dto), 'Usage Notes created');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/wheels-tires')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create wheels & tires section' })
  createWheelsTires(@GetUser('userId') userId: string, @Param('id') carId: string, @Body() dto: UpdateWheelsTiresDto) {
    return handleRequest(async () => this.carService.createWheelsTires(userId, carId, dto), 'Wheels & Tires created');
  }

  // ✅ Existing PATCH APIs (Update sections)

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/engine-power')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update engine & power section' })
  updateEnginePower(@GetUser('userId') userId: string, @Param('id') carId: string, @Body() dto: UpdateEnginePowerDto) {
    return handleRequest(async () => this.carService.updateEnginePower(userId, carId, dto), 'Engine & Power updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/drivetrain')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update drivetrain section' })
  updateDrivetrain(@GetUser('userId') userId: string, @Param('id') carId: string, @Body() dto: UpdateDrivetrainDto) {
    return handleRequest(async () => this.carService.updateDrivetrain(userId, carId, dto), 'Drivetrain updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/chassis-brakes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update chassis & brakes section' })
  updateChassisBrakes(@GetUser('userId') userId: string, @Param('id') carId: string, @Body() dto: UpdateChassisBrakesDto) {
    return handleRequest(async () => this.carService.updateChassisBrakes(userId, carId, dto), 'Chassis & Brakes updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/tuning-aero')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update tuning & aero section' })
  updateTuningAero(@GetUser('userId') userId: string, @Param('id') carId: string, @Body() dto: UpdateTuningAeroDto) {
    return handleRequest(async () => this.carService.updateTuningAero(userId, carId, dto), 'Tuning & Aero updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/interior-safety')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update interior & safety section' })
  updateInteriorSafety(@GetUser('userId') userId: string, @Param('id') carId: string, @Body() dto: UpdateInteriorSafetyDto) {
    return handleRequest(async () => this.carService.updateInteriorSafety(userId, carId, dto), 'Interior & Safety updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/usage-notes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update usage notes section' })
  updateUsageNotes(@GetUser('userId') userId: string, @Param('id') carId: string, @Body() dto: UpdateUsageNotesDto) {
    return handleRequest(async () => this.carService.updateUsageNotes(userId, carId, dto), 'Usage Notes updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/wheels-tires')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update wheels & tires section' })
  updateWheelsTires(@GetUser('userId') userId: string, @Param('id') carId: string, @Body() dto: UpdateWheelsTiresDto) {
    return handleRequest(async () => this.carService.updateWheelsTires(userId, carId, dto), 'Wheels & Tires updated');
  }
}