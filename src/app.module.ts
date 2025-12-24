import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './main/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './main/files/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
