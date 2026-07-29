import { Module } from '@nestjs/common';
import { NotificationModule } from '../../notification/notification.module';
import { SpottingRequestModule } from '../../sportting-request/sportting-request.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [NotificationModule, SpottingRequestModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
