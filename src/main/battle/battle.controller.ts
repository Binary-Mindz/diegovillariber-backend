import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { BattleService } from './battle.service';
import { BattleQueryDto } from './dto/battle-query.dto';
import { CreateBattleEntryDto } from './dto/create-battle-entry.dto';

@ApiTags('Battles')
@Controller('battles')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List battles' })
  @ApiResponse({ status: 200, description: 'Battles fetched successfully' })
  async list(@Query() query: BattleQueryDto) {
    return handleRequest(
      async () => this.battleService.listBattles(query),
      'Battles fetched successfully',
      HttpStatus.OK,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get battle details' })
  @ApiResponse({ status: 200, description: 'Battle fetched successfully' })
  async details(@Param('id') id: string) {
    return handleRequest(
      async () => this.battleService.getBattleDetails(id),
      'Battle fetched successfully',
      HttpStatus.OK,
    );
  }

  @Post(':id/join')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Join a battle (max 10)' })
  @ApiResponse({ status: 201, description: 'Joined battle successfully' })
  async join(@GetUser('userId') userId: string, @Param('id') battleId: string) {
    return handleRequest(
      async () => this.battleService.joinBattle(userId, battleId),
      'Joined battle successfully',
      HttpStatus.CREATED,
    );
  }

  @Post(':id/entry')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create battle entry (participant post)' })
  @ApiResponse({ status: 201, description: 'Battle entry created successfully' })
  async createEntry(
    @GetUser('userId') userId: string,
    @Param('id') battleId: string,
    @Body() dto: CreateBattleEntryDto,
  ) {
    return handleRequest(
      async () => this.battleService.createEntry(userId, battleId, dto),
      'Battle entry created successfully',
      HttpStatus.CREATED,
    );
  }

  @Post(':id/vote/:entryId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Vote for an entry (one vote per battle)' })
  @ApiResponse({ status: 201, description: 'Vote submitted successfully' })
  async vote(
    @GetUser('userId') voterUserId: string,
    @Param('id') battleId: string,
    @Param('entryId') entryId: string,
  ) {
    return handleRequest(
      async () => this.battleService.vote(voterUserId, battleId, entryId),
      'Vote submitted successfully',
      HttpStatus.CREATED,
    );
  }
}
