import { Module } from '@nestjs/common';
import { PostRatingController } from './post-rating.controller';
import { PostRatingService } from './post-rating.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  controllers: [PostRatingController],
  providers: [PostRatingService, PrismaService],
  exports: [PostRatingService],
})
export class PostRatingModule {}