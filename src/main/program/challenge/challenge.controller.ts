import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { SubmitChallengePostDto } from './dto/submit-challenge-post.dto';
import { ChallengeService } from './challenge.service';
import { Roles } from '@/common/decorator/roles.tdecorator';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { UpdateChallengeStatusDto } from './dto/update-challenge-status.dto';

@ApiTags('Challenges')
@Controller('challenges')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  // ---------- POST ----------
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'ADMIN: Create challenge' })
  create(@GetUser('userId') userId: string, @Body() dto: CreateChallengeDto) {
    return handleRequest(async () => {
      return this.challengeService.createChallenge(userId, dto);
    }, 'Challenge created');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'USER: Join challenge' })
  join(@Param('id') challengeId: string, @GetUser('userId') userId: string) {
    return handleRequest(async () => {
      return this.challengeService.joinChallenge(challengeId, userId);
    }, 'Joined challenge');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'USER: Submit challenge post (one submission)' })
  submit(
    @Param('id') challengeId: string,
    @GetUser('userId') userId: string,
    @Body() dto: SubmitChallengePostDto,
  ) {
    return handleRequest(async () => {
      return this.challengeService.submitChallengePost(userId, { ...dto, challengeId });
    }, 'Submission created');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':id/finalize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ADMIN: Finalize winner by highest likes' })
  finalize(@Param('id') challengeId: string, @GetUser('userId') adminId: string) {
    return handleRequest(async () => {
      return this.challengeService.finalizeChallenge(challengeId, adminId);
    }, 'Challenge finalized');
  }

  // ---------- GET ----------
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List challenges (public)' })
  list(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return handleRequest(async () => {
      return this.challengeService.listChallenges({
        status,
        search,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });
    }, 'Challenges fetched');
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get challenge details' })
  get(@Param('id') challengeId: string) {
    return handleRequest(async () => this.challengeService.getChallenge(challengeId), 'Challenge fetched');
  }

  @Get(':id/participants')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get challenge participants' })
  participants(@Param('id') challengeId: string) {
    return handleRequest(async () => this.challengeService.getParticipants(challengeId), 'Participants fetched');
  }

  @Get(':id/submissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get challenge submissions' })
  submissions(@Param('id') challengeId: string) {
    return handleRequest(async () => this.challengeService.getSubmissions(challengeId), 'Submissions fetched');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my status in challenge' })
  me(@Param('id') challengeId: string, @GetUser('userId') userId: string) {
    return handleRequest(async () => this.challengeService.getMyChallengeStatus(challengeId, userId), 'My status fetched');
  }

  // ---------- PATCH (ADMIN) ----------
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ADMIN: Update challenge details' })
  update(
    @Param('id') challengeId: string,
    @GetUser('userId') adminId: string,
    @Body() dto: UpdateChallengeDto,
  ) {
    return handleRequest(async () => {
      return this.challengeService.updateChallenge(challengeId, adminId, dto);
    }, 'Challenge updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ADMIN: Update challenge status' })
  updateStatus(
    @Param('id') challengeId: string,
    @GetUser('userId') adminId: string,
    @Body() dto: UpdateChallengeStatusDto,
  ) {
    return handleRequest(async () => {
      return this.challengeService.updateChallengeStatus(challengeId, adminId, dto.isActive);
    }, 'Challenge status updated');
  }
}