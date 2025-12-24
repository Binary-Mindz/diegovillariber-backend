import { Module } from '@nestjs/common';
import { FileService } from './file.service';

import { S3Service } from './s3/s3.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { FileController } from './file.controller';

@Module({
  imports: [ConfigModule],
  controllers: [FileController],
  providers: [FileService, S3Service, PrismaService],
})
export class FileModule {}
