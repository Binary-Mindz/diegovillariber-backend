import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';


import { SplitScreenService } from './split-screen.service';
import { CreateSplitScreenMatchDto } from './dto/create-split-screen-match.dto';
import { SplitScreenBattleQueryDto } from './dto/split-screen-battle-query.dto';
import { LeagueRankingQueryDto } from './dto/league-ranking-query.dto';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { VoteSplitScreenBattleDto } from './dto/vote-split-screen.dto';

@ApiTags('Split Screen Arena')
@ApiBearerAuth()
@Controller('split-screen')
@UseGuards(JwtAuthGuard)
export class SplitScreenController {
  constructor(private readonly splitScreenService: SplitScreenService) {}

  @Get('my-profile-cars/:profileId')
  @ApiOperation({ summary: 'Get my profile cars for split screen selection' })
  async getMyProfileCars(
    @GetUser('userId') userId: string,
    @Param('profileId') profileId: string,
  ) {
    return this.splitScreenService.getMyProfileCars(userId, profileId);
  }

  @Get('my-searching-request')
  @ApiOperation({ summary: 'Get my current split screen searching request' })
  async mySearchingRequest(@GetUser('userId') userId: string,) {
    return this.splitScreenService.mySearchingRequest(userId);
  }

  @Post('find-match')
  @ApiOperation({ summary: 'Create matchmaking request or instantly match' })
  async findMatch(
    @GetUser('userId') userId: string,
    @Body() dto: CreateSplitScreenMatchDto,
  ) {
    return this.splitScreenService.findMatch(userId, dto);
  }

  @Patch('cancel-search/:requestId')
  @ApiOperation({ summary: 'Cancel my split screen searching request' })
  async cancelSearch(
    @GetUser('userId') userId: string,
    @Param('requestId') requestId: string,
  ) {
    return this.splitScreenService.cancelSearch(userId, requestId);
  }

  @Get('battles')
  @ApiOperation({ summary: 'Get split screen battles list' })
  async getBattles(@Query() query: SplitScreenBattleQueryDto) {
    return this.splitScreenService.getBattles(query);
  }

  @Get('my-battles')
  @ApiOperation({ summary: 'Get my split screen battles' })
  async myBattles(
    @GetUser('userId') userId: string,
    @Query() query: SplitScreenBattleQueryDto,
  ) {
    return this.splitScreenService.myBattles(userId, query);
  }

  @Get('battles/:battleId')
  @ApiOperation({ summary: 'Get split screen battle details' })
  async getBattleById(@Param('battleId') battleId: string) {
    return this.splitScreenService.getBattleById(battleId);
  }

  @Post('battles/:battleId/vote')
  @ApiOperation({ summary: 'Vote on a split screen battle' })
  async voteBattle(
    @GetUser('userId') userId: string,
    @Param('battleId') battleId: string,
    @Body() dto: VoteSplitScreenBattleDto,
  ) {
    return this.splitScreenService.voteBattle(userId, battleId, dto);
  }

  @Patch('battles/:battleId/complete')
  @ApiOperation({ summary: 'Complete split screen battle and declare winner' })
  async completeBattle(@Param('battleId') battleId: string) {
    return this.splitScreenService.completeBattle(battleId);
  }

  @Get('league-rankings')
  @ApiOperation({ summary: 'Get split screen league rankings' })
  async getLeagueRankings(@Query() query: LeagueRankingQueryDto) {
    return this.splitScreenService.getLeagueRankings(query);
  }
}