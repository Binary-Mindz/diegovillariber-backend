import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './main/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './main/files/file.module';
import { UserModule } from './main/user/user.module';
import { PostModule } from './main/post/post.module';
import { LikeModule } from './main/like/like.module';
import { CommentModule } from './main/comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    PostModule,
    LikeModule,
    CommentModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
