import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { SubmitLabTimeController } from './submit-lab-time.controller';
import { SubmitLabTimeService } from './submit-lab-time.service';

@Module({
  controllers: [SubmitLabTimeController],
  providers: [SubmitLabTimeService, PrismaService],
  exports: [SubmitLabTimeService],
})
export class SubmitLabTimeModule {}