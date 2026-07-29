import { BullModule } from '@nestjs/bullmq';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { SpottingRequestController } from './sportting-request.controller';
import { SpottingRequestService } from './sportting-request.service';
import { SpottingMatcherService } from './spotting-matcher.service';
import { SpottingMatchProcessor } from './spotting-match.processor';

@Module({
  imports: [
    NotificationModule,
    BullModule.registerQueue({ name: 'spotting-match' }),
  ],
  controllers: [SpottingRequestController],
  providers: [
    SpottingRequestService,
    SpottingMatcherService,
    SpottingMatchProcessor,
    PrismaService,
  ],
  exports: [SpottingRequestService],
})
export class SpottingRequestModule {}
