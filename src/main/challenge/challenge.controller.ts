import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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

@ApiTags('Challenges')
@Controller('challenges')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

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
      // enforce param == body
      return this.challengeService.submitChallengePost(userId, {
        ...dto,
        challengeId,
      });
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
}
