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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { CreateAmbassadorProgramDto } from './dto/create-ambassador-program.dto';
import { UpdateAmbassadorProgramDto } from './dto/update-ambassador-program.dto';
import { AmbassadorProgramQueryDto } from './dto/ambassador-program-query.dto';
import { UpdateAmbassadorStatusDto } from './dto/update-ambassador-status.dto';
import { AmbassadorProgramService } from './ambassador-program.service';

@ApiTags('Ambassador Program')
@Controller('ambassador-program')
export class AmbassadorProgramController {
  constructor(private readonly ambassadorProgramService: AmbassadorProgramService) {}

  /** -----------------------
   * USER APIs
   * ----------------------*/

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Apply for ambassador program (user)' })
  @ApiResponse({ status: 201, description: 'Application created successfully' })
  async apply(
    @GetUser('userId') userId: string,
    @Body() dto: CreateAmbassadorProgramDto,
  ) {
    return handleRequest(
      async () => this.ambassadorProgramService.apply(userId, dto),
      'Ambassador application submitted successfully',
      HttpStatus.CREATED,
    );
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my application (user)' })
  @ApiResponse({ status: 200, description: 'Application fetched successfully' })
  async myApplication(@GetUser('userId') userId: string) {
    return handleRequest(
      async () => this.ambassadorProgramService.getMine(userId),
      'Ambassador application fetched successfully',
      HttpStatus.OK,
    );
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
  ) {
    return handleRequest(
      async () => this.ambassadorProgramService.updateMine(userId, dto),
      'Ambassador application updated successfully',
      HttpStatus.OK,
    );
  }

  @Delete('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete my application (user)' })
  @ApiResponse({ status: 200, description: 'Application deleted successfully' })
  async deleteMine(@GetUser('userId') userId: string) {
    return handleRequest(
      async () => this.ambassadorProgramService.deleteMine(userId),
      'Ambassador application deleted successfully',
      HttpStatus.OK,
    );
  }

  /** -----------------------
   * ADMIN APIs (add Roles/Guards in your project)
   * ----------------------*/

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // add RolesGuard + @Roles('admin') if you have
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List applications (admin)' })
  @ApiResponse({ status: 200, description: 'Applications fetched successfully' })
  async list(@Query() query: AmbassadorProgramQueryDto) {
    return handleRequest(
      async () => this.ambassadorProgramService.list(query),
      'Ambassador applications fetched successfully',
      HttpStatus.OK,
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // admin
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get application by id (admin)' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Application fetched successfully' })
  async getById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return handleRequest(
      async () => this.ambassadorProgramService.getById(id),
      'Ambassador application fetched successfully',
      HttpStatus.OK,
    );
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // admin
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update application status (admin)' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  async updateStatus(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateAmbassadorStatusDto,
  ) {
    return handleRequest(
      async () => this.ambassadorProgramService.updateStatus(id, dto),
      'Ambassador application status updated successfully',
      HttpStatus.OK,
    );
  }
}
