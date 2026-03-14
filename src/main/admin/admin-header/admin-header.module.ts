import { Module } from '@nestjs/common';
import { AdminHeaderController } from './admin-header.controller';
import { AdminHeaderService } from './admin-header.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  controllers: [AdminHeaderController],
  providers: [AdminHeaderService, PrismaService],
  exports: [AdminHeaderService],
})
export class AdminHeaderModule {}