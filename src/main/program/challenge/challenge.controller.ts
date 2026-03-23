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

import { ChallengeService } from './challenge.service';
import { ChallengeQueryDto } from './dto/challenge-query.dto';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { SubmitChallengeDto } from './dto/submit-challenge.dto';
import { VoteChallengeDto } from './dto/vote-challenge.dto';
import { ReactChallengeDto } from './dto/react-challenge.dto';
import { CreateChallengeCommentDto } from './dto/comment-challenge.dto';
import { JoinChallengeDto } from './dto/join-challenge.dto';

@ApiTags('Challenge')
@Controller('challenges')
export class ChallengeController {
  constructor(private readonly service: ChallengeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List challenges (tabs: Active/Upcoming/Finished/Draft)' })
  async list(
    @Query() query: ChallengeQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      async () => {
        return await this.service.listChallenges(query);
      },
      'Challenges fetched successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }

  @Get('admin/created')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List challenges created by admin users' })
  async listAdminCreatedChallenges(
    @Query() query: ChallengeQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      async () => {
        return await this.service.listAdminCreatedChallenges(query);
      },
      'Admin created challenges fetched successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get challenge details' })
  @ApiResponse({ status: 200 })
  async details(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      async () => {
        return await this.service.getChallenge(id);
      },
      'Challenge fetched successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Get(':id/comments')
@ApiOperation({ summary: 'Get comments for a challenge submission (with replies)' })
async getComments(
  @Param('id') challengeId: string,
  @Query('submissionId') submissionId: string,
) {
  return handleRequest(async () => {
    return this.service.getComments(challengeId, submissionId);
  }, 'Comments fetched successfully');
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Get('comments/:commentId')
@ApiOperation({ summary: 'Get single comment (with replies)' })
async getSingleComment(
  @Param('commentId') commentId: string,
) {
  return handleRequest(async () => {
    return this.service.getSingleComment(commentId);
  }, 'Comment fetched successfully');
}




  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create challenge' })
  async create(
    @GetUser('userId') userId: string,
    @Body() dto: CreateChallengeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      async () => {
        return await this.service.createChallenge(userId, dto);
      },
      'Challenge created successfully',
      HttpStatus.CREATED,
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update challenge (creator only)' })
  async update(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Body() dto: UpdateChallengeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      async () => {
        return await this.service.updateChallenge(id, userId, dto);
      },
      'Challenge updated successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete challenge (creator only)' })
  async remove(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      async () => {
        return await this.service.deleteChallenge(id, userId);
      },
      'Challenge deleted successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join challenge (creates participant)' })
  async join(
    @Param('id') challengeId: string,
    @GetUser('userId') userId: string,
    @Body() dto: JoinChallengeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      async () => {
        return await this.service.joinChallenge(challengeId, userId, dto);
      },
      'Joined challenge successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit challenge media (respects maxEntriesPerUser)' })
  async submit(
    @Param('id') challengeId: string,
    @GetUser('userId') userId: string,
    @Body() dto: SubmitChallengeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      async () => {
        return await this.service.submit(challengeId, userId, dto);
      },
      'Submission submitted successfully',
      HttpStatus.CREATED,
    );

    res.status(response.statusCode);
    return response;
  }

  @Get(':id/submissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List submissions for a challenge' })
  async listSubmissions(
    @Param('id') challengeId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      async () => {
        return await this.service.listSubmissions(challengeId);
      },
      'Submissions fetched successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
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
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      async () => {
        return await this.service.vote(submissionId, userId, dto);
      },
      'Vote submitted successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
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
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      async () => {
        return await this.service.react(submissionId, userId, dto);
      },
      'Reaction updated successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
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
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      async () => {
        return await this.service.createComment(challengeId, userId, dto);
      },
      'Comment added successfully',
      HttpStatus.CREATED,
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete challenge (creator only). Creates result + winners.' })
  async complete(
    @Param('id') challengeId: string,
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      async () => {
        return await this.service.completeChallenge(challengeId, userId);
      },
      'Challenge completed successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }
}