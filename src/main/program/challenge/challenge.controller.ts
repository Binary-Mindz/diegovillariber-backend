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
import { ChallengeQueryDto } from './dto/challenge-query.dto';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { SubmitChallengeDto } from './dto/submit-challenge.dto';
import { VoteChallengeDto } from './dto/vote-challenge.dto';
import { ReactChallengeDto } from './dto/react-challenge.dto';
import { CreateChallengeCommentDto } from './dto/comment-challenge.dto';
import { ChallengeService } from './challenge.service';
import { JoinChallengeDto } from './dto/join-challenge.dto';

@ApiTags('Challenge')
@Controller('challenges')
export class ChallengeController {
  constructor(private readonly service: ChallengeService) {}

  @Get()
  @ApiOperation({ summary: 'List challenges (tabs: Active/Upcoming/Finished/Draft)' })
  async list(@Query() query: ChallengeQueryDto) {
    return this.service.listChallenges(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get challenge details' })
  @ApiResponse({ status: 200 })
  async details(@Param('id') id: string) {
    return handleRequest(async () => this.service.getChallenge(id), 'Challenge fetched successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create challenge' })
  async create(@GetUser('userId') userId: string, @Body() dto: CreateChallengeDto) {
    return handleRequest(async () => this.service.createChallenge(userId, dto), 'Challenge created successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update challenge (creator only)' })
  async update(@Param('id') id: string, @GetUser('userId') userId: string, @Body() dto: UpdateChallengeDto) {
    return handleRequest(async () => this.service.updateChallenge(id, userId, dto), 'Challenge updated successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete challenge (creator only)' })
  async remove(@Param('id') id: string, @GetUser('userId') userId: string) {
    return handleRequest(async () => this.service.deleteChallenge(id, userId), 'Challenge deleted successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join challenge (creates participant)' })
  async join(@Param('id') challengeId: string, @GetUser('userId') userId: string, @Body() dto: JoinChallengeDto) {
    return handleRequest(async () => this.service.joinChallenge(challengeId, userId, dto), 'Joined challenge successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit challenge media (respects maxEntriesPerUser)' })
  async submit(@Param('id') challengeId: string, @GetUser('userId') userId: string, @Body() dto: SubmitChallengeDto) {
    return handleRequest(async () => this.service.submit(challengeId, userId, dto), 'Submission submitted successfully');
  }

  @Get(':id/submissions')
  @ApiOperation({ summary: 'List submissions for a challenge' })
  async listSubmissions(@Param('id') challengeId: string) {
    return handleRequest(async () => this.service.listSubmissions(challengeId), 'Submissions fetched successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('submissions/:submissionId/vote')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vote on a submission (one vote per user per submission)' })
  async vote(
    @Param('submissionId') submissionId: string,
    @GetUser('userId') userId: string,
    @Body() dto: VoteChallengeDto,
  ) {
    return handleRequest(async () => this.service.vote(submissionId, userId, dto), 'Vote submitted successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('submissions/:submissionId/react')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'React to a submission (LIKE/LOVE/FIRE/WOW)' })
  async react(
    @Param('submissionId') submissionId: string,
    @GetUser('userId') userId: string,
    @Body() dto: ReactChallengeDto,
  ) {
    return handleRequest(async () => this.service.react(submissionId, userId, dto), 'Reaction updated successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Comment on challenge or a submission (supports replies)' })
  async comment(
    @Param('id') challengeId: string,
    @GetUser('userId') userId: string,
    @Body() dto: CreateChallengeCommentDto,
  ) {
    return handleRequest(async () => this.service.createComment(challengeId, userId, dto), 'Comment added successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete challenge (creator only). Creates result + winners.' })
  async complete(@Param('id') challengeId: string, @GetUser('userId') userId: string) {
    return handleRequest(async () => this.service.completeChallenge(challengeId, userId), 'Challenge completed successfully');
  }
}