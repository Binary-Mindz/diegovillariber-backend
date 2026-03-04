import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class EventStatusJob {
  private readonly logger = new Logger(EventStatusJob.name);

  constructor(private readonly prisma: PrismaService) {}
// check in every hour
  @Cron(CronExpression.EVERY_HOUR)
  async syncEventStatuses() {
    const now = new Date();

    const ongoing = await this.prisma.event.updateMany({
      where: {
        eventStatus: 'UPCOMING',
        startDate: { lte: now },
        endDate: { gte: now },
      },
      data: { eventStatus: 'ONGOING' },
    });

    const completed = await this.prisma.event.updateMany({
      where: {
        eventStatus: { in: ['UPCOMING', 'ONGOING'] },
        endDate: { lt: now },
      },
      data: { eventStatus: 'COMPLETED' },
    });

    if (ongoing.count || completed.count) {
      this.logger.log(
        `Event status synced → ONGOING: ${ongoing.count}, COMPLETED: ${completed.count}`,
      );
    }
  }
}