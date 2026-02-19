import { Module } from '@nestjs/common';
import { HashtagModule } from './hashtag/hashtag.module';
import { AdminOverviewModule } from './admin-overview/admin-overview.module';

@Module({
  imports: [AdminOverviewModule, HashtagModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AdminModule {}