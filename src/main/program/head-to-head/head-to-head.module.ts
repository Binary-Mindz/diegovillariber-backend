import { Module } from '@nestjs/common';
import { HeadToHeadController } from './head-to-head.controller';
import { HeadToHeadService } from './head-to-head.service';
import { HeadToHeadBattleCron } from './head-to-head.cron';

@Module({
  controllers: [HeadToHeadController],
  providers: [HeadToHeadService, HeadToHeadBattleCron],
  exports: [HeadToHeadService],
})
export class HeadToHeadModule {}