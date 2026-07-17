import { PrismaService } from '@/common/prisma/prisma.service';
import { NotificationModule } from '@/main/notification/notification.module';
import { NotificationService } from '@/main/notification/notification.service';
import { Module } from '@nestjs/common';
import { RawShiftController } from './rawshift.controller';
import { RawShiftService } from './rawshift.service';

@Module({
  imports: [NotificationModule],
  controllers: [RawShiftController],
  providers: [RawShiftService, PrismaService, NotificationService],
  exports: [RawShiftService],
})
export class RawShiftModule {}
