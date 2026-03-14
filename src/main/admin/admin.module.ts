import { Module } from '@nestjs/common';
import { HashtagModule } from './hashtag/hashtag.module';
import { AdminOverviewModule } from './admin-overview/admin-overview.module';
import { AdminAnalyticModule } from './admin-analytic/admin-analytic.module';
import { AdminUserManagementModule } from './admin-user-management/admin-user-management.module';
import { AdminLegalNoticeModule } from './legal-notice/legal-notice.module';
import { AdminEventManagementModule } from './admin-event-management/admin-event-management.module';
import { AdminReportModule } from './admin-report/admin-report.module';
import { AdminTutorialModule } from './admin-tutorial/admin-tutorial.module';
import { AdminSimRacingModule } from './admin-sim-racing/admin-sim-racing.module';
import { AdminAdModule } from './admin-ad/admin-ad.module';
import { AdminHeaderModule } from './admin-header/admin-header.module';

@Module({
  imports: [AdminOverviewModule, AdminAnalyticModule, AdminUserManagementModule, AdminLegalNoticeModule, AdminTutorialModule, HashtagModule, AdminEventManagementModule, AdminReportModule, AdminSimRacingModule, AdminAdModule, AdminHeaderModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AdminModule {}