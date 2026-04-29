import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AdminAdController } from './admin-ad.controller';
import { AdminAdService } from './admin-ad.service';

@Module({
  controllers: [AdminAdController],
  providers: [AdminAdService, PrismaService],
  exports: [AdminAdService],
})
export class AdminAdModule {}