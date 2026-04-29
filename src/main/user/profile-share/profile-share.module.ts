import { Module } from '@nestjs/common';
import { ProfileShareController } from './profile-share.controller';
import { ProfileShareService } from './profile-share.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  controllers: [ProfileShareController],
  providers: [ProfileShareService, PrismaService],
  exports: [ProfileShareService],
})
export class ProfileShareModule {}