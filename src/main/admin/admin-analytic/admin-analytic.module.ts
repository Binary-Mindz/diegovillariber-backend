import { Module } from '@nestjs/common';
import { AdminAnalyticController } from './admin-analytic.controller';
import { AdminAnalyticService } from './admin-analytic.service';

@Module({
  imports: [],
  controllers: [AdminAnalyticController],
  providers: [AdminAnalyticService],
  exports: [],
})
export class AdminAnalyticModule {}