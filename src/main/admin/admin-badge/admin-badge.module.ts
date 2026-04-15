import { Module } from '@nestjs/common';
import { AdminBadgeController } from './admin-badge.controller';
import { AdminBadgeService } from './admin-badge.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  controllers: [AdminBadgeController],
  providers: [AdminBadgeService, PrismaService],
  exports: [AdminBadgeService],
})
export class AdminBadgeModule {}