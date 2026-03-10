import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ChallengeStatus } from 'generated/prisma/enums';

@Injectable()
export class ChallengeCronService {
  private readonly logger = new Logger(ChallengeCronService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async syncChallengeStatuses() {
    const now = new Date();

    try {
      // 1) UPCOMING -> ACTIVE
      const activeResult = await this.prisma.challenge.updateMany({
        where: {
          status: ChallengeStatus.UPCOMING,
          startDate: { lte: now },
          endDate: { gte: now },
        },
        data: {
          status: ChallengeStatus.ACTIVE,
        },
      });

      // 2) UPCOMING -> FINISHED
      const finishedFromUpcoming = await this.prisma.challenge.updateMany({
        where: {
          status: ChallengeStatus.UPCOMING,
          endDate: { lt: now },
        },
        data: {
          status: ChallengeStatus.FINISHED,
        },
      });

      // 3) ACTIVE -> FINISHED
      const finishedFromActive = await this.prisma.challenge.updateMany({
        where: {
          status: ChallengeStatus.ACTIVE,
          endDate: { lt: now },
        },
        data: {
          status: ChallengeStatus.FINISHED,
        },
      });

      const totalUpdated =
        activeResult.count +
        finishedFromUpcoming.count +
        finishedFromActive.count;

      if (totalUpdated > 0) {
        this.logger.log(
          `Challenge status sync completed. ACTIVE: ${activeResult.count}, FINISHED(from UPCOMING): ${finishedFromUpcoming.count}, FINISHED(from ACTIVE): ${finishedFromActive.count}`,
        );
      }
    } catch (error) {
      this.logger.error('Failed to sync challenge statuses', error?.stack || error);
    }
  }
}