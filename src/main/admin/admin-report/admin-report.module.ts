import { Module } from '@nestjs/common';
import { AdminReportController } from './admin-report.controller';
import { AdminReportService } from './admin-report.service';
import { PrismaService } from '@/common/prisma/prisma.service';


@Module({
  controllers: [AdminReportController],
  providers: [AdminReportService, PrismaService],
})
export class AdminReportModule {}