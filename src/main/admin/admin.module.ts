import { Module } from '@nestjs/common';
import { HashtagModule } from './hashtag/hashtag.module';


@Module({
  imports: [HashtagModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AdminModule {}