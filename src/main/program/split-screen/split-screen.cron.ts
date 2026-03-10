import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SplitScreenService } from './split-screen.service';

@Injectable()
export class SplitScreenCron {
  private readonly logger = new Logger(SplitScreenCron.name);

  constructor(private readonly splitScreenService: SplitScreenService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleExpiredVotingBattles() {
    const count = await this.splitScreenService.autoCompleteExpiredBattles();
    if (count > 0) {
      this.logger.log(`Auto-completed ${count} SplitScreen battle(s)`);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleExpiredInvitations() {
    const count = await this.splitScreenService.expirePendingInvitations();
    if (count > 0) {
      this.logger.log(`Expired ${count} SplitScreen invitation(s)`);
    }
  }
}