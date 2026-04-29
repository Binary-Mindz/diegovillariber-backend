import { Module } from '@nestjs/common';
import { MotorsportRankingController } from './motorsport-ranking.controller';
import { MotorsportRankingService } from './motorsport-ranking.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  controllers: [MotorsportRankingController],
  providers: [MotorsportRankingService, PrismaService],
  exports: [MotorsportRankingService],
})
export class MotorsportRankingModule {}