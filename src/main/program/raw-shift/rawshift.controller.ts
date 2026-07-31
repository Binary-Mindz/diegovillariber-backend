import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorator/roles.tdecorator';

@ApiTags('RawShift')
@Controller('raw-shift')
export class RawShiftController {
  constructor(private readonly service: RawShiftService) {}

  @Get()
  @ApiOperation({
    summary:
      'List RawShift battles (tabs: All/Active/Finished) with pagination',
  })
  @ApiResponse({ status: 200 })
  async list(@Query() query: RawShiftQueryDto) {
    return handleRequest(
      async () => this.service.listBattles(query),
      'RawShift battles fetched successfully',
      HttpStatus.OK,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my-voted-entries')
  @ApiOperation({ summary: 'Get entries I already voted' })
  async myVotedEntries(@GetUser('userId') userId: string) {
    console.log('hitted');
    return handleRequest(async () => {
      return this.service.myVotedEntries(userId);
    }, 'My voted entries fetched successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get RawShift battle details' })
  @ApiResponse({ status: 200 })
  async details(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return handleRequest(
      async () => this.service.getBattle(id),
      'RawShift battle fetched successfully',
      HttpStatus.OK,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/comments')
  @ApiOperation({
    summary: 'Get comments for a RawShift battle or specific entry',
  })
  async getComments(
    @Param('id') battleId: string,
    @Query('entryId') entryId?: string,
  ) {
    return handleRequest(async () => {
      return this.service.getComments(battleId, entryId);
    }, 'Comments fetched successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OFFICIAL_PARTNER', 'AMBASSADOR')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create RawShift battle (Admin/Partner/Ambassador)',
  })
  async create(
    @GetUser('userId') userId: string,
    @Body() dto: CreateRawShiftBattleDto,
  ) {
    return handleRequest(
      async () => this.service.createBattle(userId, dto),
      'RawShift battle created successfully',
      HttpStatus.CREATED,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OFFICIAL_PARTNER', 'AMBASSADOR')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update RawShift battle (Admin any / others creator only)',
  })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @GetUser('userId') userId: string,
    @Body() dto: UpdateRawShiftBattleDto,
  ) {
    return handleRequest(
      async () => this.service.updateBattle(id, userId, dto),
      'RawShift battle updated successfully',
      HttpStatus.OK,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OFFICIAL_PARTNER', 'AMBASSADOR')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete RawShift battle (Admin any / others creator only)',
  })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @GetUser('userId') userId: string,
  ) {
    return handleRequest(
      async () => this.service.deleteBattle(id, userId),
      'RawShift battle deleted successfully',
      HttpStatus.OK,
    );
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
  @ApiOperation({
    summary:
      'Submit RawShift entry (RAW + Edited). Upsert (1 entry per user per battle)',
  })
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
  @Get('comments/:commentId')
  @ApiOperation({ summary: 'Get single comment by ID' })
  async getSingleComment(@Param('commentId') commentId: string) {
    return handleRequest(async () => {
      return this.service.getSingleComment(commentId);
    }, 'Comment fetched successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Complete RawShift battle (creator only). Picks winner by highest score.',
  })
  async complete(
    @Param('id') battleId: string,
    @GetUser('userId') userId: string,
  ) {
    return handleRequest(async () => {
      return this.service.completeBattle(battleId, userId);
    }, 'RawShift battle completed successfully');
  }
}
