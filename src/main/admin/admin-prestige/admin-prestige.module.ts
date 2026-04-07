import { Module } from '@nestjs/common';
import { AdminPrestigeController } from './admin-prestige.controller';
import { AdminPrestigeService } from './admin-prestige.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  controllers: [AdminPrestigeController],
  providers: [AdminPrestigeService, PrismaService],
})
export class AdminPrestigeModule {}