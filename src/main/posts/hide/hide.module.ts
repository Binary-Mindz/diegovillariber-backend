import { Module } from '@nestjs/common';
import { HideService } from './hide.service';
import { HideController } from './hide.controller';


@Module({
  controllers: [HideController],
  providers: [HideService],
  exports: [HideService],
})
export class HideModule {}
