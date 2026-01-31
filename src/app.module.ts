import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './main/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './main/user/user.module';
import { PostsModule } from './main/posts/posts.module';
import { ProProfileModule } from './main/pro-profile/pro-profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    PostsModule,
    ProProfileModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
