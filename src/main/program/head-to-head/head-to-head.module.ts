import { Module } from '@nestjs/common';
import { HeadToHeadController } from './head-to-head.controller';
import { HeadToHeadService } from './head-to-head.service';

@Module({
  controllers: [HeadToHeadController],
  providers: [HeadToHeadService],
  exports: [HeadToHeadService],
})
export class HeadToHeadModule {}