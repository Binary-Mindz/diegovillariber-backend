import { NotificationModule } from '@/main/notification/notification.module';
import { Module } from '@nestjs/common';
import { HeadToHeadController } from './head-to-head.controller';
import { HeadToHeadBattleCron } from './head-to-head.cron';
import { HeadToHeadService } from './head-to-head.service';

@Module({
  imports: [NotificationModule],
  controllers: [HeadToHeadController],
  providers: [HeadToHeadService, HeadToHeadBattleCron],
  exports: [HeadToHeadService],
})
export class HeadToHeadModule {}
