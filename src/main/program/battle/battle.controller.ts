import {
  Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { BattleService } from './battle.service';
import { CreateBattleDto } from './dto/create-battle.dto';
import { SubmitBattlePostDto } from './dto/submit-battle-post.dto';
import { VoteBattleDto } from './dto/vote-battle.dto';

@ApiTags('Battles')
@Controller('battles')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create battle' })
  create(@GetUser('userId') userId: string, @Body() dto: CreateBattleDto) {
    return handleRequest(async () => {
      return this.battleService.createBattle(userId, dto);
    }, 'Battle created');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List battles (public feed)' })
  list(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return handleRequest(async () => {
      return this.battleService.listBattles({
        status,
        category,
        search,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });
    }, 'Battles fetched');
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get battle details' })
  get(@Param('id') battleId: string) {
    return handleRequest(async () => this.battleService.getBattle(battleId), 'Battle fetched');
  }

    @Get(':id/participants')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get battle participants' })
  participants(@Param('id') battleId: string) {
    return handleRequest(async () => this.battleService.getParticipants(battleId), 'Participants fetched');
  }

  @Get(':id/entries')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get battle entries with votes count' })
  entries(@Param('id') battleId: string) {
    return handleRequest(async () => this.battleService.getEntries(battleId), 'Entries fetched');
  }

  @Get(':id/leaderboard')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get battle leaderboard (sorted by votes)' })
  leaderboard(@Param('id') battleId: string) {
    return handleRequest(async () => this.battleService.getLeaderboard(battleId), 'Leaderboard fetched');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my status in battle (joined/submitted/voted)' })
  me(@Param('id') battleId: string, @GetUser('userId') userId: string) {
    return handleRequest(async () => this.battleService.getMyBattleStatus(battleId, userId), 'My battle status fetched');
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Join battle' })
  join(@Param('id') battleId: string, @GetUser('userId') userId: string) {
    return handleRequest(async () => {
      return this.battleService.joinBattle(battleId, userId);
    }, 'Joined battle');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit battle post (creates entry)' })
  submit(
    @Param('id') battleId: string,
    @GetUser('userId') userId: string,
    @Body() dto: SubmitBattlePostDto,
  ) {
    return handleRequest(async () => {
      return this.battleService.submitBattlePost(battleId, userId, dto);
    }, 'Battle post submitted');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/vote')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Vote battle (one vote per user per battle)' })
  vote(
    @Param('id') battleId: string,
    @GetUser('userId') userId: string,
    @Body() dto: VoteBattleDto,
  ) {
    return handleRequest(async () => {
      return this.battleService.voteBattle(battleId, userId, dto.entryId);
    }, 'Voted');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/finalize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Finalize battle winner by votes' })
  finalize(@Param('id') battleId: string, @GetUser('userId') userId: string) {
    return handleRequest(async () => {
      return this.battleService.finalizeBattle(battleId, userId);
    }, 'Battle finalized');
  }
}
