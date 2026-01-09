import {
  Injectable,
  OnModuleInit,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');

    const adapter = new PrismaPg({ connectionString });
    super({
      adapter,
      log: [{ emit: 'event', level: 'error' }],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('database is connected');
  }
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('database is disconnected');
  }
}
