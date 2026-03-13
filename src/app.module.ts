import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './main/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './main/user/user.module';
import { PostsModule } from './main/posts/posts.module';
import { ProProfileModule } from './main/pro-profile/pro-profile.module';
import { AdminModule } from './main/admin/admin.module';
import { ProductModule } from './main/product/product.module';
import { ProgramModule } from './main/program/program.module';
import { ChatModule } from './main/chat/chat.module';
import { FileModule } from './main/files/file.module';
import { PropertyModule } from './main/property/property.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FirebaseModule } from './main/firebase/firebase.module';
import { MotorsportRankingModule } from './main/motorsport/motorsport-ranking.module';
import { NotificationModule } from './main/notification/notification.module';
import { RacingVoteModule } from './main/racing-vote/racing-vote.module';
import { SpottingRequestModule } from './main/sportting-request/sportting-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    PostsModule,
    ProProfileModule,
    ProgramModule,
    ProductModule,
    PropertyModule,
    ChatModule,
    FileModule,
    NotificationModule,
    SpottingRequestModule,
    FirebaseModule,
    RacingVoteModule,
    MotorsportRankingModule,
    AdminModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
