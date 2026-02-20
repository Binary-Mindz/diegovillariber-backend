import { Module } from '@nestjs/common';
import { AdminLegalNoticeService } from './legal.notice.service';
import { AdminLegalNoticeController } from './legal-notice.controller';



@Module({
  imports: [],
  controllers: [AdminLegalNoticeController],
  providers: [AdminLegalNoticeService],
  exports: [],
})
export class AdminLegalNoticeModule {}