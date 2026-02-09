import {
  Body, Controller, HttpCode, HttpStatus, Param, Post, UseGuards,
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
