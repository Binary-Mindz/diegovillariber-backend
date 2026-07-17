import { PrismaService } from '@/common/prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import { BattleStatus } from 'generated/prisma/enums';

@Injectable()
export class HeadToHeadBattleCron {
  private readonly logger = new Logger(HeadToHeadBattleCron.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('notification') private readonly notificationQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async syncBattleStatuses() {
    const now = new Date();

    const upcomingBattles = await this.prisma.headToHeadBattle.findMany({
      where: {
        status: BattleStatus.UPCOMING,
        startDate: { lte: now },
        endDate: { gt: now },
      },
      select: { id: true, title: true },
    });

    if (upcomingBattles.length > 0) {
      await this.prisma.headToHeadBattle.updateMany({
        where: {
          id: { in: upcomingBattles.map((b) => b.id) },
        },
        data: {
          status: BattleStatus.ACTIVE,
        },
      });

      for (const battle of upcomingBattles) {
        await this.notificationQueue.add(
          'head-to-head-activated',
          { battleId: battle.id, title: battle.title },
          { removeOnComplete: true, removeOnFail: true },
        );
      }
    }

    const toFinishedFromActive = await this.prisma.headToHeadBattle.updateMany({
      where: {
        status: BattleStatus.ACTIVE,
        endDate: { lte: now },
      },
      data: {
        status: BattleStatus.FINISHED,
      },
    });

    const toFinishedFromUpcoming =
      await this.prisma.headToHeadBattle.updateMany({
        where: {
          status: BattleStatus.UPCOMING,
          endDate: { lte: now },
        },
        data: {
          status: BattleStatus.FINISHED,
        },
      });

    if (
      upcomingBattles.length > 0 ||
      toFinishedFromActive.count ||
      toFinishedFromUpcoming.count
    ) {
      this.logger.log(
        `Battle status sync: ACTIVE=${upcomingBattles.length}, FINISHED_FROM_ACTIVE=${toFinishedFromActive.count}, FINISHED_FROM_UPCOMING=${toFinishedFromUpcoming.count}`,
      );
    }
  }
}
