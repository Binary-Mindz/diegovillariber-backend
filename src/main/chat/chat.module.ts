import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from '@/common/prisma/prisma.service';


@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
  ],
  controllers: [ChatController],
  providers: [
    PrismaService,
    ChatService,
    ChatGateway,
  ],
  exports: [ChatService],
})
export class ChatModule {}