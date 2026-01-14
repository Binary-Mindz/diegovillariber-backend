import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './folloe.controller';

@Module({
  controllers: [FollowController],
  providers: [FollowService],
  exports: [FollowService]
})
export class FollowModule {}