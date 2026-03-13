import { Module } from '@nestjs/common';
import { UserPointController } from './user-point.controller';
import { UserPointService } from './user-point.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  controllers: [UserPointController],
  providers: [UserPointService, PrismaService],
  exports: [UserPointService],
})
export class UserPointModule {}