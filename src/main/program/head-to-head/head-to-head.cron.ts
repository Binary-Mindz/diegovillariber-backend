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

    
    const toRunning = await this.prisma.headToHeadBattle.updateMany({
      where: {
        status: BattleStatus.PUBLISHED,
        startDate: { lte: now },
        endDate: { gt: now }, 
      },
      data: { status: BattleStatus.RUNNING },
    });

  
    const toCompleted = await this.prisma.headToHeadBattle.updateMany({
      where: {
        status: BattleStatus.RUNNING,
        endDate: { lte: now },
      },
      data: { status: BattleStatus.COMPLETED },
    });

    
    const publishedExpired = await this.prisma.headToHeadBattle.updateMany({
      where: {
        status: BattleStatus.PUBLISHED,
        endDate: { lte: now },
      },
      data: { status: BattleStatus.COMPLETED },
    });

    if (toRunning.count || toCompleted.count || publishedExpired.count) {
      this.logger.log(
        `status sync: RUNNING=${toRunning.count}, COMPLETED=${toCompleted.count}, PUBLISHED_EXPIRED=${publishedExpired.count}`,
      );
    }
  }
}