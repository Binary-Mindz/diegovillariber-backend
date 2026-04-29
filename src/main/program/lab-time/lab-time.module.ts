import { Module } from '@nestjs/common';
import { LabTimeController } from './lab-time.controller';
import { LabTimeService } from './lab-time.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  controllers: [LabTimeController],
  providers: [LabTimeService, PrismaService],
  exports: [LabTimeService],
})
export class LabTimeModule {}