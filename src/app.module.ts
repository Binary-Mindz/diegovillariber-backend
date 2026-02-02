import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './main/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './main/user/user.module';
import { PostsModule } from './main/posts/posts.module';
import { ProProfileModule } from './main/pro-profile/pro-profile.module';
import { BattleModule } from './main/battle/battle.module';
import { AdminModule } from './main/admin/admin.module';
import { EventModule } from './main/event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    PostsModule,
    ProProfileModule,
    BattleModule,
    EventModule,
    AdminModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
