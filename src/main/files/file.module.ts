import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  imports: [ConfigModule],
  controllers: [FileController],
  providers: [
    FileService,
    CloudinaryService, 
    PrismaService,
  ],
  exports: [FileService, CloudinaryService], 
})
export class FileModule {}

