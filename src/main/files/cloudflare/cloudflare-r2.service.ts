import { PrismaService } from '@/common/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FileType } from 'generated/prisma/enums';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class CloudflareR2Service {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(private readonly prisma: PrismaService) {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

    this.bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'images';
    this.publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL || '';

    this.s3Client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || '',
      },
      region: 'auto',
    });
  }

  async uploadFileBuffer(
    fileBuffer: Buffer,
    originalName: string,
    mimetype: string,
  ) {
    if (!fileBuffer || !originalName) {
      throw new BadRequestException(
        'File buffer and original name are required',
      );
    }

    const ext = originalName.split('.').pop();
    const baseName = `${Date.now()}-${originalName.replace(/\.[^/.]+$/, '')}`;
    const fileCategory = this.resolveFileCategory(mimetype);

    // Organizes files into virtual folders: images/, videos/, docs/
    const folder =
      fileCategory === 'image'
        ? 'images'
        : fileCategory === 'video'
          ? 'videos'
          : 'docs';

    const key = `${folder}/${baseName}.${ext}`;

    // Cloudflare R2 upload using S3 API
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: fileBuffer,
          ContentType: mimetype,
        }),
      );
    } catch (error) {
      throw new BadRequestException(`Failed to upload file to Cloudflare R2: ${error.message}`);
    }

    const secureUrl = `${this.publicUrl}/${key}`;

    // Prisma create file record (keeps same schema mapping)
    const fileRecord = await this.prisma.fileInstance.create({
      data: {
        filename: `${baseName}.${ext}`,
        originalFilename: originalName,
        path: key, // Storing the R2 Key as the path for deletion later
        url: secureUrl,
        fileType:
          fileCategory === 'image'
            ? FileType.IMAGE
            : fileCategory === 'video'
              ? FileType.VIDEO
              : FileType.DOCS,
        mimeType: mimetype,
        size: fileBuffer.length,
      },
    });

    return fileRecord;
  }

  async deleteResource(id: string) {
    const fileOnDb = await this.prisma.fileInstance.findUnique({
      where: { id },
    });

    if (!fileOnDb) {
      throw new BadRequestException('File not available on the server');
    }

    // Cloudflare R2 delete using S3 API
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: fileOnDb.path, // The key stored during upload
        }),
      );
    } catch (error) {
      throw new BadRequestException(`Failed to delete file from Cloudflare R2: ${error.message}`);
    }

    // Remove from Database
    await this.prisma.fileInstance.delete({ where: { id } });

    return {
      success: true,
      id: fileOnDb.id,
      message: 'File deleted successfully from Cloudflare R2 and database',
    };
  }

  private resolveFileCategory(mimeType: string): 'image' | 'video' | 'raw' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'raw';
  }
}
