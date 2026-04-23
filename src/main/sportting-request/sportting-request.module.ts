import { Module } from '@nestjs/common';
import { SpottingRequestController } from './sportting-request.controller';
import { PrismaService } from '@/common/prisma/prisma.service';
import { SpottingRequestService } from './sportting-request.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [SpottingRequestController],
  providers: [SpottingRequestService, PrismaService],
  exports: [SpottingRequestService],
})
export class SpottingRequestModule {}