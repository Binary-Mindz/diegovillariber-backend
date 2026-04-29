import { Module } from '@nestjs/common';
import { RacingVoteController } from './racing-vote.controller';
import { RacingVoteService } from './racing-vote.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  controllers: [RacingVoteController],
  providers: [RacingVoteService, PrismaService],
  exports: [RacingVoteService],
})
export class RacingVoteModule {}