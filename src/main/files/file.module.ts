import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CloudflareR2Service } from './cloudflare/cloudflare-r2.service';

@Module({
  imports: [ConfigModule],
  controllers: [FileController],
  providers: [
    FileService,
    CloudflareR2Service,
    PrismaService,
  ],
  exports: [FileService, CloudflareR2Service],
})
export class FileModule { }

