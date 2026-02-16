import { PrismaService } from '@/common/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FileType } from 'generated/prisma/enums';
import { v2 as cloudinary } from 'cloudinary';


@Injectable()
export class CloudinaryService {
  constructor(private readonly prisma: PrismaService) {
     cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
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
    const resourceType = this.resolveResourceType(mimetype);
    const folder =
      resourceType === 'image'
        ? 'images'
        : resourceType === 'video'
        ? 'videos'
        : 'docs';

    const publicId = resourceType === 'raw' ? `${baseName}.${ext}` : baseName;

    // Cloudinary upload
    const uploadPromise = new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder,
          type: 'upload',
          public_id: publicId,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(fileBuffer);
    });

    const result = await uploadPromise;

    // Prisma create file record
    const fileRecord = await this.prisma.fileInstance.create({
      data: {
        filename: result.public_id.split('/').pop()!,
        originalFilename: originalName,
        path: result.public_id,
        url: result.secure_url,
        fileType:
          resourceType === 'image'
            ? FileType.IMAGE
            : resourceType === 'video'
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

    const resourceType = this.mapFileTypeToResourceType(fileOnDb.fileType);

    const result = await cloudinary.uploader.destroy(fileOnDb.path, {
      resource_type: resourceType,
      invalidate: true,
    });

    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new BadRequestException('Failed to delete file from Cloudinary');
    }

    await this.prisma.fileInstance.delete({ where: { id } });

    return {
      success: true,
      id: fileOnDb.id,
      resourceType,
      message: 'File deleted successfully',
    };
  }

  private resolveResourceType(mimeType: string): 'image' | 'video' | 'raw' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'raw';
  }

  private mapFileTypeToResourceType(fileType: FileType): 'image' | 'video' | 'raw' {
    switch (fileType) {
      case FileType.IMAGE:
        return 'image';
      case FileType.VIDEO:
        return 'video';
      default:
        return 'raw';
    }
  }
}
