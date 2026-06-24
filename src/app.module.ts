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
import { MotorsportRankingModule } from './main/motorsport/motorsport-ranking.module';
import { NotificationModule } from './main/notification/notification.module';
import { RacingVoteModule } from './main/racing-vote/racing-vote.module';
import { SpottingRequestModule } from './main/sportting-request/sportting-request.module';
import { DiscoverModule } from './main/discover/discover.module';
import { MapModule } from './main/map/map.module';
import { FirebaseModule } from './common/firebase/firebase.module';
import * as path from 'path';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import * as fs from 'fs';

const getI18nPath = () => {
  const devPath = path.join(process.cwd(), 'src', 'i18n');
  if (fs.existsSync(devPath)) return devPath;

  const prodPath = path.join(process.cwd(), 'dist', 'src', 'i18n');
  if (fs.existsSync(prodPath)) return prodPath;

  return path.join(process.cwd(), 'i18n');
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
      resolvers: [
        new HeaderResolver(['accept-language']),
      ],
    }),
    PrismaModule,
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
    AdminModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
