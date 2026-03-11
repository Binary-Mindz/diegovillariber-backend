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
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorator/roles.tdecorator';
import { Role } from 'generated/prisma/enums';

@ApiTags('HeadToHead')
@Controller('head-to-head')
export class HeadToHeadController {
  constructor(private readonly service: HeadToHeadService) {}

  @Get()
  @ApiOperation({
    summary: 'List HeadToHead battles (tabs: Active/Upcoming/Finished)',
  })
  async list(
    @Query() query: HeadToHeadQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.listBattles(query),
      'HeadToHead battles fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get HeadToHead battle details' })
  @ApiResponse({ status: 200 })
  async details(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.getBattle(id),
      'HeadToHead battle fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create HeadToHead battle access: ADMIN, OFFICIAL_PARTNER, AMBASSADOR' })
  @Roles(Role.ADMIN, Role.OFFICIAL_PARTNER, Role.AMBASSADOR)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create HeadToHead battle' })
  async create(
    @GetUser('userId') userId: string,
    @Body() dto: CreateHeadToHeadBattleDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log("userId", userId)
    const response = await handleRequest(
      () => this.service.createBattle(userId, dto),
      'HeadToHead battle created successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICIAL_PARTNER, Role.AMBASSADOR)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update HeadToHead battle (creator only) ADMIN, OFFICIAL_PARTNER, AMBASSADOR '})
  async update(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Body() dto: UpdateHeadToHeadBattleDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.updateBattle(id, userId, dto),
      'HeadToHead battle updated successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICIAL_PARTNER, Role.AMBASSADOR)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete HeadToHead battle (creator only) ADMIN, OFFICIAL_PARTNER, AMBASSADOR' })
  async remove(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.deleteBattle(id, userId),
      'HeadToHead battle deleted successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Join HeadToHead battle (creates participant). Handles accessType rules.',
  })
  async join(
    @Param('id') battleId: string,
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.joinBattle(battleId, userId),
      'Joined HeadToHead battle successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/invite')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Invite a user to HeadToHead battle (creator only or inviter = creator)',
  })
  async invite(
    @Param('id') battleId: string,
    @GetUser('userId') inviterId: string,
    @Body() dto: InviteHeadToHeadDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.inviteUser(battleId, inviterId, dto),
      'Invitation sent successfully',
    );

    res.status(response.statusCode);
    return response;
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
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.respondInvitation(invitationId, userId, dto),
      'Invitation updated successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Submit HeadToHead media (Upsert: 1 submission per user per battle)',
  })
  async submit(
    @Param('id') battleId: string,
    @GetUser('userId') userId: string,
    @Body() dto: SubmitHeadToHeadDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.submit(battleId, userId, dto),
      'Submission submitted successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('submissions/:submissionId/vote')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Vote on a HeadToHead submission (like/rating future-proof)',
  })
  async vote(
    @Param('submissionId') submissionId: string,
    @GetUser('userId') userId: string,
    @Body() dto: VoteHeadToHeadDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.vote(submissionId, userId, dto),
      'Vote submitted successfully',
    );

    res.status(response.statusCode);
    return response;
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
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.createComment(battleId, userId, dto),
      'Comment added successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Complete HeadToHead battle (creator only). Picks winner by highest votes.',
  })
  async complete(
    @Param('id') battleId: string,
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.completeBattle(battleId, userId),
      'HeadToHead battle completed successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}