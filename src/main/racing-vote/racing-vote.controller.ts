import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';

import { RacingVoteService } from './racing-vote.service';
import { CreateRacingVoteDto } from './dto/create-racing-vote.dto';
import { RacingVoteLeaderboardDto } from './dto/racing-vote-leaderboard.dto';

@ApiTags('RacingVote')
@Controller('racing-votes')
export class RacingVoteController {
  constructor(private readonly service: RacingVoteService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      'Give a racing vote to a user or a post. Daily max 5 votes, same target only once per day.',
  })
  async createVote(
    @GetUser('userId') userId: string,
    @Body() dto: CreateRacingVoteDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.createVote(userId, dto),
      'Racing vote submitted successfully',
    );

    res.status(response.statusCode);
    return response;
  }

@Get('top-users')
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary: 'Get top voted users leaderboard',
})
async topUsers(
  @Query() query: RacingVoteLeaderboardDto,
  @Res({ passthrough: true }) res: Response,
) {
  const response = await handleRequest(
    () => this.service.topVotedUsers(query),
    'Top voted users fetched successfully',
  );

  res.status(response.statusCode);
  return response;
}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my-today')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get today voting summary of current user',
  })
  async myTodayVotes(
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.myTodayVoteSummary(userId),
      'Today racing vote summary fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}