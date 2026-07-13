import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import * as fs from 'fs';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { FirebaseModule } from './common/firebase/firebase.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { TranslationService } from './common/services/translation.service';
import { AdminModule } from './main/admin/admin.module';
import { AuthModule } from './main/auth/auth.module';
import { ChatModule } from './main/chat/chat.module';
import { DiscoverModule } from './main/discover/discover.module';
import { FileModule } from './main/files/file.module';
import { MapModule } from './main/map/map.module';
import { MotorsportRankingModule } from './main/motorsport/motorsport-ranking.module';
import { NotificationModule } from './main/notification/notification.module';
import { PostsModule } from './main/posts/posts.module';
import { ProProfileModule } from './main/pro-profile/pro-profile.module';
import { ProductModule } from './main/product/product.module';
import { ProgramModule } from './main/program/program.module';
import { PropertyModule } from './main/property/property.module';
import { RacingVoteModule } from './main/racing-vote/racing-vote.module';
import { SpottingRequestModule } from './main/sportting-request/sportting-request.module';
import { UserModule } from './main/user/user.module';

const getI18nPath = () => {
  const rootPath = path.join(process.cwd(), 'i18n');
  if (fs.existsSync(rootPath)) return rootPath;

  const devPath = path.join(process.cwd(), 'src', 'i18n');
  if (fs.existsSync(devPath)) return devPath;

  return rootPath;
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: getI18nPath(),
        watch: true,
      },
      resolvers: [new HeaderResolver(['accept-language'])],
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    PrismaModule, // নিশ্চিত করুন এই মডিউলের ভেতর PrismaService এক্সপোর্ট করা আছে
    DiscoverModule,
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
    MapModule,
    AdminModule,
  ],
  controllers: [],
  providers: [TranslationService],
  exports: [TranslationService], // অন্য লেয়ার বা ইন্টারসেপ্টর থেকে অ্যাক্সেস পাওয়ার জন্য এক্সপোর্ট করা হলো
})
export class AppModule {}
