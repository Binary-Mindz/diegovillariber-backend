import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { SaveModule } from './save/save.module';
import { HideModule } from './hide/hide.module';

@Module({
  imports: [PostModule, LikeModule, CommentModule, SaveModule, HideModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class PostsModule {}
