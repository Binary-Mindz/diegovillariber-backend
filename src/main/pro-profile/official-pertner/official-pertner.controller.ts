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
import { OfficialPartnerService } from './official-pertner.service';
import { CreateOfficialPartnerDto } from './dto/create-official-pertner.dto';
import { UpdateOfficialPartnerDto } from './dto/update-official-pertner.dto';
import { OfficialPartnerQueryDto } from './dto/official-pertner.dto';
import { UpdateOfficialPartnerStatusDto } from './dto/update-request-status.dto';



@ApiTags('Official Partners')
@Controller('official-partners')
export class OfficialPartnerController {
  constructor(private readonly officialPartnerService: OfficialPartnerService) {}


  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create official partner request (user)' })
  @ApiResponse({ status: 201, description: 'Request created successfully' })
  async createRequest(
    @GetUser('userId') userId: string,
    @Body() dto: CreateOfficialPartnerDto,
  ) {
    return handleRequest(
      async () => this.officialPartnerService.createRequest(userId, dto),
      'Official partner request created successfully',
      HttpStatus.CREATED,
    );
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my official partner request (user)' })
  @ApiResponse({ status: 200, description: 'Request fetched successfully' })
  async getMyRequest(@GetUser('userId') userId: string) {
    return handleRequest(
      async () => this.officialPartnerService.getMyRequest(userId),
      'Official partner request fetched successfully',
      HttpStatus.OK,
    );
  }

  @Patch('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update my official partner request (only if PENDING)' })
  @ApiResponse({ status: 200, description: 'Request updated successfully' })
  async updateMyRequest(
    @GetUser('userId') userId: string,
    @Body() dto: UpdateOfficialPartnerDto,
  ) {
    return handleRequest(
      async () => this.officialPartnerService.updateMyRequest(userId, dto),
      'Official partner request updated successfully',
      HttpStatus.OK,
    );
  }

  @Delete('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete my official partner request' })
  @ApiResponse({ status: 200, description: 'Request deleted successfully' })
  async deleteMyRequest(@GetUser('userId') userId: string) {
    return handleRequest(
      async () => this.officialPartnerService.deleteMyRequest(userId),
      'Official partner request deleted successfully',
      HttpStatus.OK,
    );
  }

  /** -----------------------
   * ADMIN APIs (guard/roles add your own)
   * ----------------------*/

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // add RolesGuard + @Roles('admin') if you have it
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List official partner requests (admin)' })
  @ApiResponse({ status: 200, description: 'Requests fetched successfully' })
  async list(@Query() query: OfficialPartnerQueryDto) {
    return handleRequest(
      async () => this.officialPartnerService.list(query),
      'Official partner requests fetched successfully',
      HttpStatus.OK,
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) 
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a request by id (admin)' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Request fetched successfully' })
  async getById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return handleRequest(
      async () => this.officialPartnerService.getById(id),
      'Official partner request fetched successfully',
      HttpStatus.OK,
    );
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // admin
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve/Reject request (admin)' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  async updateStatus(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateOfficialPartnerStatusDto,
  ) {
    return handleRequest(
      async () => this.officialPartnerService.updateStatus(id, dto),
      'Official partner request status updated successfully',
      HttpStatus.OK,
    );
  }
}
