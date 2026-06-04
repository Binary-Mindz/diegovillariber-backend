import { Module } from '@nestjs/common';
import { AdminReportController } from './admin-report.controller';
import { AdminReportService } from './admin-report.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { NotificationModule } from '../../notification/notification.module';


@Module({
  imports:[NotificationModule],
  controllers: [AdminReportController],
  providers: [AdminReportService, PrismaService],
})
export class AdminReportModule {}