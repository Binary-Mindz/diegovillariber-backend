import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { CreateSpottingRequestDto } from './dto/create-sportting-request.dto';
import { SpottingRequestService } from './sportting-request.service';
import { NearbyPostsDto } from './dto/nearby-post.dto';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Spotting Requests')
@Controller('spotting-requests')
export class SpottingRequestController {
  constructor(
    private readonly spottingRequestService: SpottingRequestService,
  ) {}

  @Post()
  async create(
    @GetUser('userId') userId: string,
    @Body() dto: CreateSpottingRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.spottingRequestService.createSpottingRequest(userId, dto),
      'Spotting request created successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get('my')
  async myRequests(
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.spottingRequestService.getMySpottingRequests(userId),
      'Spotting requests fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Patch(':id/pause')
  async pause(
    @GetUser('userId') userId: string,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.spottingRequestService.pauseRequest(userId, id),
      'Spotting request paused successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Patch(':id/activate')
  async activate(
    @GetUser('userId') userId: string,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.spottingRequestService.activateRequest(userId, id),
      'Spotting request activated successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Patch(':id/cancel')
  async cancel(
    @GetUser('userId') userId: string,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.spottingRequestService.cancelRequest(userId, id),
      'Spotting request cancelled successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get(':id/matches')
  async matches(
    @GetUser('userId') userId: string,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.spottingRequestService.getRequestMatches(userId, id),
      'Spotting request matches fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Post('nearby-posts')
  async nearbyPosts(
    @GetUser('userId') userId: string,
    @Body() dto: NearbyPostsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.spottingRequestService.getNearbyPosts(userId, dto),
      'Nearby spots fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}