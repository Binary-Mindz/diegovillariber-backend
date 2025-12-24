import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { S3Service } from './s3/s3.service';
import { FileType } from 'generated/prisma/enums';

@Injectable()
export class FileService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  async uploadFile(buffer: Buffer, originalname: string, mimetype: string) {
    const { url, key } = await this.s3Service.uploadFile(
      buffer,
      originalname,
      mimetype,
    );

    const fileType: FileType = this.s3Service.getFileType(mimetype);

    return this.prisma.fileInstance.create({
      data: {
        filename: key.split('/').pop() ?? key,
        originalFilename: originalname,
        path: key,
        url,
        fileType,
        mimeType: mimetype,
        size: buffer.length,
      },
    });
  }

  async deleteFile(id: string) {
    const file = await this.prisma.fileInstance.findUnique({
      where: { id },
    });

    if (!file) throw new NotFoundException('File not found');

    await this.s3Service.deleteFile(file.path);

    await this.prisma.fileInstance.delete({
      where: { id },
    });

    return { success: true };
  }

  async getFiles(skip = 0, take = 10) {
    const [files, total] = await Promise.all([
      this.prisma.fileInstance.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.fileInstance.count(),
    ]);

    return { files, total };
  }

  async getFile(id: string) {
    const file = await this.prisma.fileInstance.findUnique({
      where: { id },
    });

    if (!file) throw new NotFoundException('File not found');

    return file;
  }
}
