import { PrismaService } from '@/common/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { SpottingRequestController } from './sportting-request.controller';
import { SpottingRequestService } from './sportting-request.service';
import { SpottingMatcherService } from './spotting-matcher.service';

@Module({
  imports: [NotificationModule],
  controllers: [SpottingRequestController],
  providers: [SpottingRequestService, SpottingMatcherService, PrismaService],
  exports: [SpottingRequestService],
})
export class SpottingRequestModule {}
