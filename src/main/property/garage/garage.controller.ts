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


import { CreateGarageDto } from './dto/create-garage.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { GarageService } from './garage.service';
import { UpdateGarageDto } from './dto/update-garage.dto';

@ApiTags('Garages')
@Controller('garages')
export class GarageController {
  constructor(private readonly garageService: GarageService) {}


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create garage (Authenticated users)' })
  create(
    @GetUser('userId') userId: string,
    @Body() dto: CreateGarageDto,
  ) {
    return handleRequest(async () => {
      return this.garageService.createGarage(userId, dto);
    }, 'Garage created successfully');
  }

  
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my garages' })
  getMyGarages(@GetUser('userId') userId: string) {
    return handleRequest(async () => {
      return this.garageService.getUserGarages(userId);
    }, 'Garages fetched');
  }

  
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get garage details' })
  get(@Param('id') garageId: string) {
    return handleRequest(async () => {
      return this.garageService.getGarage(garageId);
    }, 'Garage fetched');
  }

  
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update garage (Owner only)' })
  update(
    @GetUser('userId') userId: string,
    @Param('id') garageId: string,
    @Body() dto: UpdateGarageDto,
  ) {
    return handleRequest(async () => {
      return this.garageService.updateGarage(userId, garageId, dto);
    }, 'Garage updated');
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete garage (Owner only)' })
  delete(
    @GetUser('userId') userId: string,
    @Param('id') garageId: string,
  ) {
    return handleRequest(async () => {
      return this.garageService.deleteGarage(userId, garageId);
    }, 'Garage deleted');
  }
}
