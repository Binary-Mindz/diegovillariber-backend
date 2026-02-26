import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';

import { RawShiftQueryDto } from './dto/rawshift-query.dto';
import { CreateRawShiftBattleDto } from './dto/create-rawshift-battle.dto';
import { UpdateRawShiftBattleDto } from './dto/update-rawshift-battle.dto';
import { SubmitRawShiftEntryDto } from './dto/submit-rawshift-entry.dto';
import { VoteRawShiftDto } from './dto/vote-rawshift.dto';
import { CreateRawShiftCommentDto } from './dto/comment-rawshift.dto';
import { RawShiftService } from './rawshift.service';

@ApiTags('RawShift')
@Controller('raw-shift')
export class RawShiftController {
  constructor(private readonly service: RawShiftService) {}

  @Get()
  @ApiOperation({ summary: 'List RawShift battles (tabs: Active/Upcoming/Finished)' })
  async list(@Query() query: RawShiftQueryDto) {
    return this.service.listBattles(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get RawShift battle details' })
  @ApiResponse({ status: 200 })
  async details(@Param('id') id: string) {
    return handleRequest(async () => {
      return this.service.getBattle(id);
    }, 'RawShift battle fetched successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create RawShift battle' })
  async create(
    @GetUser('userId') userId: string,
    @Body() dto: CreateRawShiftBattleDto,
  ) {
    return handleRequest(async () => {
      return this.service.createBattle(userId, dto);
    }, 'RawShift battle created successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update RawShift battle (creator only)' })
  async update(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Body() dto: UpdateRawShiftBattleDto,
  ) {
    return handleRequest(async () => {
      return this.service.updateBattle(id, userId, dto);
    }, 'RawShift battle updated successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete RawShift battle (creator only)' })
  async remove(@Param('id') id: string, @GetUser('userId') userId: string) {
    return handleRequest(async () => {
      return this.service.deleteBattle(id, userId);
    }, 'RawShift battle deleted successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join RawShift battle (creates participant)' })
  async join(@Param('id') battleId: string, @GetUser('userId') userId: string) {
    return handleRequest(async () => {
      return this.service.joinBattle(battleId, userId);
    }, 'Joined RawShift battle successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit RawShift entry (RAW + Edited). Upsert (1 entry per user per battle)' })
  async submitEntry(
    @Param('id') battleId: string,
    @GetUser('userId') userId: string,
    @Body() dto: SubmitRawShiftEntryDto,
  ) {
    return handleRequest(async () => {
      return this.service.submitEntry(battleId, userId, dto);
    }, 'Entry submitted successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('entries/:entryId/vote')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vote on a RawShift entry (like/rating)' })
  async vote(
    @Param('entryId') entryId: string,
    @GetUser('userId') userId: string,
    @Body() dto: VoteRawShiftDto,
  ) {
    return handleRequest(async () => {
      return this.service.voteEntry(entryId, userId, dto);
    }, 'Vote submitted successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Comment on RawShift battle or a specific entry' })
  async comment(
    @Param('id') battleId: string,
    @GetUser('userId') userId: string,
    @Body() dto: CreateRawShiftCommentDto,
  ) {
    return handleRequest(async () => {
      return this.service.createComment(battleId, userId, dto);
    }, 'Comment added successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete RawShift battle (creator only). Picks winner by highest score.' })
  async complete(@Param('id') battleId: string, @GetUser('userId') userId: string) {
    return handleRequest(async () => {
      return this.service.completeBattle(battleId, userId);
    }, 'RawShift battle completed successfully');
  }
}