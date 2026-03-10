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
import { RolesGuard } from '@/common/guards/roles.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { Roles } from '@/common/decorator/roles.tdecorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { Role } from 'generated/prisma/enums';

import { SplitScreenService } from './split-screen.service';
import { SplitScreenQueryDto } from './dto/split-screen-query.dto';
import { CreateSplitScreenBattleDto } from './dto/create-split-screen-battle.dto';
import { UpdateSplitScreenBattleDto } from './dto/update-split-screen-battle.dto';
import { InviteSplitScreenDto } from './dto/invite-split-screen.dto';
import { RespondSplitScreenInvitationDto } from './dto/respond-split-screen-invitation.dto';
import { SubmitSplitScreenDto } from './dto/submit-split-screen.dto';
import { VoteSplitScreenDto } from './dto/vote-split-screen.dto';
import { CreateSplitScreenCommentDto } from './dto/comment-split-screen.dto';

@ApiTags('SplitScreen')
@Controller('split-screen')
export class SplitScreenController {
  constructor(private readonly service: SplitScreenService) {}

  @Get()
  @ApiOperation({ summary: 'List SplitScreen battles (tabs: Active/Upcoming/Finished)' })
  async list(
    @Query() query: SplitScreenQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.listBattles(query),
      'SplitScreen battles fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }
   @Get(':id')
  @ApiOperation({ summary: 'Get SplitScreen battle details' })
  @ApiResponse({ status: 200 })
  async details(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.getBattle(id),
      'SplitScreen battle fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICIAL_PARTNER, Role.AMBASSADOR)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create SplitScreen battle access: ADMIN, OFFICIAL_PARTNER, AMBASSADOR' })
  async create(
    @GetUser('userId') userId: string,
    @Body() dto: CreateSplitScreenBattleDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.createBattle(userId, dto),
      'SplitScreen battle created successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICIAL_PARTNER, Role.AMBASSADOR)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update SplitScreen battle (creator only) ADMIN, OFFICIAL_PARTNER, AMBASSADOR' })
  async update(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Body() dto: UpdateSplitScreenBattleDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.updateBattle(id, userId, dto),
      'SplitScreen battle updated successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICIAL_PARTNER, Role.AMBASSADOR)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete SplitScreen battle (creator only) ADMIN, OFFICIAL_PARTNER, AMBASSADOR' })
  async remove(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.deleteBattle(id, userId),
      'SplitScreen battle deleted successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join SplitScreen battle (creates participant). Handles accessType rules.' })
  async join(
    @Param('id') battleId: string,
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.joinBattle(battleId, userId),
      'Joined SplitScreen battle successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/invite')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Invite a user to SplitScreen battle (creator only)' })
  async invite(
    @Param('id') battleId: string,
    @GetUser('userId') inviterId: string,
    @Body() dto: InviteSplitScreenDto,
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
  @ApiOperation({ summary: 'Accept/Decline SplitScreen invitation' })
  async respondInvitation(
    @Param('invitationId') invitationId: string,
    @GetUser('userId') userId: string,
    @Body() dto: RespondSplitScreenInvitationDto,
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
  @ApiOperation({ summary: 'Submit SplitScreen media (Upsert: 1 submission per user per battle)' })
  async submit(
    @Param('id') battleId: string,
    @GetUser('userId') userId: string,
    @Body() dto: SubmitSplitScreenDto,
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
  @ApiOperation({ summary: 'Vote on a SplitScreen submission' })
  async vote(
    @Param('submissionId') submissionId: string,
    @GetUser('userId') userId: string,
    @Body() dto: VoteSplitScreenDto,
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
  @ApiOperation({ summary: 'Comment on SplitScreen battle or a specific submission' })
  async comment(
    @Param('id') battleId: string,
    @GetUser('userId') userId: string,
    @Body() dto: CreateSplitScreenCommentDto,
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
  @ApiOperation({ summary: 'Complete SplitScreen battle (creator only). Picks winner by highest votes.' })
  async complete(
    @Param('id') battleId: string,
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.service.completeBattle(battleId, userId),
      'SplitScreen battle completed successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}
