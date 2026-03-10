import { Module } from '@nestjs/common';
import { SplitScreenController } from './split-screen.controller';
import { SplitScreenService } from './split-screen.service';
import { SplitScreenCron } from './split-screen.cron';
import { PrismaService } from '@/common/prisma/prisma.service';


@Module({
  controllers: [SplitScreenController],
  providers: [SplitScreenService, SplitScreenCron, PrismaService],
  exports: [SplitScreenService],
})
export class SplitScreenModule {}