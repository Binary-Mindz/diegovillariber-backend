// src/head-to-head/head-to-head.controller.ts
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

import { HeadToHeadQueryDto } from './dto/headtohead-query.dto';
import { CreateHeadToHeadBattleDto } from './dto/create-headtohead-battle.dto';
import { UpdateHeadToHeadBattleDto } from './dto/update-headtohead-battle.dto';
import { InviteHeadToHeadDto } from './dto/invite-headtohead.dto';
import { RespondInvitationDto } from './dto/respond-invitation.dto';
import { SubmitHeadToHeadDto } from './dto/submit-headtohead.dto';
import { VoteHeadToHeadDto } from './dto/vote-headtohead.dto';
import { CreateHeadToHeadCommentDto } from './dto/comment-headtohead.dto';

import { HeadToHeadService } from './head-to-head.service';

@ApiTags('HeadToHead')
@Controller('head-to-head')
export class HeadToHeadController {
  constructor(private readonly service: HeadToHeadService) {}

  @Get()
  @ApiOperation({ summary: 'List HeadToHead battles (tabs: Active/Upcoming/Finished)' })
  async list(@Query() query: HeadToHeadQueryDto) {
    return this.service.listBattles(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get HeadToHead battle details' })
  @ApiResponse({ status: 200 })
  async details(@Param('id') id: string) {
    return handleRequest(async () => this.service.getBattle(id), 'HeadToHead battle fetched successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create HeadToHead battle' })
  async create(@GetUser('userId') userId: string, @Body() dto: CreateHeadToHeadBattleDto) {
    return handleRequest(async () => this.service.createBattle(userId, dto), 'HeadToHead battle created successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update HeadToHead battle (creator only)' })
  async update(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Body() dto: UpdateHeadToHeadBattleDto,
  ) {
    return handleRequest(async () => this.service.updateBattle(id, userId, dto), 'HeadToHead battle updated successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete HeadToHead battle (creator only)' })
  async remove(@Param('id') id: string, @GetUser('userId') userId: string) {
    return handleRequest(async () => this.service.deleteBattle(id, userId), 'HeadToHead battle deleted successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join HeadToHead battle (creates participant). Handles accessType rules.' })
  async join(@Param('id') battleId: string, @GetUser('userId') userId: string) {
    return handleRequest(async () => this.service.joinBattle(battleId, userId), 'Joined HeadToHead battle successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/invite')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Invite a user to HeadToHead battle (creator only or inviter = creator)' })
  async invite(
    @Param('id') battleId: string,
    @GetUser('userId') inviterId: string,
    @Body() dto: InviteHeadToHeadDto,
  ) {
    return handleRequest(async () => this.service.inviteUser(battleId, inviterId, dto), 'Invitation sent successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('invitations/:invitationId/respond')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept/Decline HeadToHead invitation' })
  async respondInvitation(
    @Param('invitationId') invitationId: string,
    @GetUser('userId') userId: string,
    @Body() dto: RespondInvitationDto,
  ) {
    return handleRequest(async () => this.service.respondInvitation(invitationId, userId, dto), 'Invitation updated successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit HeadToHead media (Upsert: 1 submission per user per battle)' })
  async submit(
    @Param('id') battleId: string,
    @GetUser('userId') userId: string,
    @Body() dto: SubmitHeadToHeadDto,
  ) {
    return handleRequest(async () => this.service.submit(battleId, userId, dto), 'Submission submitted successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('submissions/:submissionId/vote')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vote on a HeadToHead submission (like/rating future-proof)' })
  async vote(
    @Param('submissionId') submissionId: string,
    @GetUser('userId') userId: string,
    @Body() dto: VoteHeadToHeadDto,
  ) {
    return handleRequest(async () => this.service.vote(submissionId, userId, dto), 'Vote submitted successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Comment on HeadToHead battle or a specific submission' })
  async comment(
    @Param('id') battleId: string,
    @GetUser('userId') userId: string,
    @Body() dto: CreateHeadToHeadCommentDto,
  ) {
    return handleRequest(async () => this.service.createComment(battleId, userId, dto), 'Comment added successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete HeadToHead battle (creator only). Picks winner by highest votes.' })
  async complete(@Param('id') battleId: string, @GetUser('userId') userId: string) {
    return handleRequest(async () => this.service.completeBattle(battleId, userId), 'HeadToHead battle completed successfully');
  }
}