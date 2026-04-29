import { Module } from '@nestjs/common';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ChallengeCronService } from './challenge-cron.service';

@Module({
  controllers: [ChallengeController],
  providers: [ChallengeService, ChallengeCronService, PrismaService],
  exports: [ChallengeService],
})
export class ChallengeModule {}