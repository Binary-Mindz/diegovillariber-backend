import { Module } from '@nestjs/common';
import { AdminOverviewController } from './admin-overview.controller';
import { AdminOverviewService } from './admin-overview.service';

@Module({
  imports: [],
  controllers: [AdminOverviewController],
  providers: [AdminOverviewService],
  exports: [],
})
export class AdminOverviewModule {}