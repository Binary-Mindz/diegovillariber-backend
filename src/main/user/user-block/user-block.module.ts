import { Module } from '@nestjs/common';
import { UserBlockController } from './user-block.controller';
import { UserBlockService } from './user-block.service';
import { PrismaService } from '@/common/prisma/prisma.service';


@Module({
  controllers: [UserBlockController],
  providers: [UserBlockService, PrismaService],
  exports: [UserBlockService],
})
export class UserBlockModule {}