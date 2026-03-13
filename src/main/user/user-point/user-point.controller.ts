import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { UserPointService } from './user-point.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('User Points')
@Controller('user-points')
export class UserPointController {
  constructor(private readonly userPointService: UserPointService) {}

 @Get('me/summary')
@UseGuards(JwtAuthGuard)
async getMySummary(
  @GetUser('userId') userId: string,
  @Res({ passthrough: true }) res: Response,
) {
  console.log(userId);
  const response = await handleRequest(
    () => this.userPointService.getMyPointSummary(userId),
    'Point summary fetched successfully',
  );

  res.status(response.statusCode);
  return response;
}

  @Get('me/history')
  async getMyHistory(
    @GetUser('id') userId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () =>
        this.userPointService.getMyPointHistory(
          userId,
          Number(page),
          Number(limit),
        ),
      'Point history fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}