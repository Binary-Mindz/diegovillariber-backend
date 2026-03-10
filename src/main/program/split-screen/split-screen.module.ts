import { Module } from '@nestjs/common';
import { SplitScreenController } from './split-screen.controller';
import { SplitScreenService } from './split-screen.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  controllers: [SplitScreenController],
  providers: [SplitScreenService, PrismaService],
  exports: [SplitScreenService],
})
export class SplitScreenModule {}