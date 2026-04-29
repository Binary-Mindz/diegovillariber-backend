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
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';



import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { GarageService } from './garage.service';
import { UpdateGarageDto } from './dto/update-garage.dto';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorator/roles.tdecorator';
import { GetAllGaragesQueryDto } from './dto/get-all-garage-query.dto';
import { Response } from 'express';

@ApiTags('Garages')
@Controller('garages')
export class GarageController {
  constructor(private readonly garageService: GarageService) {}

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
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Get('admin/all')
@ApiOperation({ summary: 'Get all garages with pagination (Admin only)' })
async getAllGarages(
  @Query() query: GetAllGaragesQueryDto,
  @Res({ passthrough: true }) res: Response,
) {
  const response = await handleRequest(
    () => this.garageService.getAllGarages(query),
    'Garages fetched successfully',
  );

  res.status(response.statusCode);
  return response;
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
