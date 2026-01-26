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
  private readonly prisma: PrismaClient;
  private readonly connectionString: string;

  constructor(private readonly configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');

    const adapter = new PrismaPg({ connectionString });

    super({
      adapter,
      log: [{ emit: 'event', level: 'error' }],
    });

    this.connectionString = connectionString;

    this.prisma = new PrismaClient({
      adapter,
      log: [{ emit: 'event', level: 'error' }],
    });
  }

  async onModuleInit() {
    await this.prisma.$connect();
    console.log('database is connected');
  }
  async onModuleDestroy() {
    await this.prisma.$disconnect();
    console.log('database is disconnected');
  }

  get client() {
    return this.prisma;
  }
}
