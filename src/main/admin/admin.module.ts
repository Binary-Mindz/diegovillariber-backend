import { Module } from '@nestjs/common';
import { HashtagModule } from './hashtag/hashtag.module';
import { AdminOverviewModule } from './admin-overview/admin-overview.module';
import { AdminAnalyticModule } from './admin-analytic/admin-analytic.module';
import { AdminUserManagementModule } from './admin-user-management/admin-user-management.module';
import { AdminLegalNoticeModule } from './legal-notice/legal-notice.module';
import { AdminEventManagementModule } from './admin-event-management/admin-event-management.module';

@Module({
  imports: [AdminOverviewModule, AdminAnalyticModule, AdminUserManagementModule, AdminLegalNoticeModule, HashtagModule, AdminEventManagementModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AdminModule {}