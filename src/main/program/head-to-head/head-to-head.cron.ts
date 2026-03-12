import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/common/prisma/prisma.service';
import { BattleStatus } from 'generated/prisma/enums';

@Injectable()
export class HeadToHeadBattleCron {
  private readonly logger = new Logger(HeadToHeadBattleCron.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async syncBattleStatuses() {
    const now = new Date();

    const toActive = await this.prisma.headToHeadBattle.updateMany({
      where: {
        status: BattleStatus.UPCOMING,
        startDate: { lte: now },
        endDate: { gt: now },
      },
      data: {
        status: BattleStatus.ACTIVE,
      },
    });

    const toFinishedFromActive = await this.prisma.headToHeadBattle.updateMany({
      where: {
        status: BattleStatus.ACTIVE,
        endDate: { lte: now },
      },
      data: {
        status: BattleStatus.FINISHED,
      },
    });

    const toFinishedFromUpcoming = await this.prisma.headToHeadBattle.updateMany({
      where: {
        status: BattleStatus.UPCOMING,
        endDate: { lte: now },
      },
      data: {
        status: BattleStatus.FINISHED,
      },
    });

    if (
      toActive.count ||
      toFinishedFromActive.count ||
      toFinishedFromUpcoming.count
    ) {
      this.logger.log(
        `Battle status sync: ACTIVE=${toActive.count}, FINISHED_FROM_ACTIVE=${toFinishedFromActive.count}, FINISHED_FROM_UPCOMING=${toFinishedFromUpcoming.count}`,
      );
    }
  }
}