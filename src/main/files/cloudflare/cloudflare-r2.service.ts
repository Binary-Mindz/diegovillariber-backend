import { PrismaService } from '@/common/prisma/prisma.service';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { FileType } from 'generated/prisma/enums';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg'; 
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

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

  private async compressImage(buffer: Buffer): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .resize({ width: 1280, withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true, mozjpeg: true }) 
        .toBuffer();
    } catch (error) {
      throw new InternalServerErrorException(`Image optimization failed: ${error.message}`);
    }
  }


private async compressVideo(fileBuffer: Buffer, originalName: string): Promise<{ buffer: Buffer; ext: string; mimetype: string }> {
  const tempDir = path.join(process.cwd(), 'temp-uploads');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, '_');
  const inputPath = path.join(tempDir, `in_${Date.now()}_${sanitizedName}`);
  const outputPath = path.join(tempDir, `out_${Date.now()}.mp4`);

  // বাফার ফাইলে রাইট করা
  await writeFileAsync(inputPath, fileBuffer);

  return new Promise((resolve, reject) => {
    // ভিডিওর মেটাডাটা (Resolution) রিড করা
    ffmpeg.ffprobe(inputPath, async (err, metadata) => {
      if (err) {
        if (fs.existsSync(inputPath)) await unlinkAsync(inputPath).catch(() => { });
        return reject(new InternalServerErrorException(`Failed to probe video metadata: ${err.message}`));
      }

      const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
      const originalWidth = videoStream?.width || 0;
      const originalHeight = videoStream?.height || 0;

      // ডিফল্ট আউটপুট অপশনস
      const outputOptions = [
        '-crf 28', // সাইজ অপ্টিমাইজেশন (কোয়ালিটি ব্যালেন্স)
        '-preset fast',
        '-pix_fmt yuv420p' // প্রায় সব ডিভাইসে প্লেব্যাক সাপোর্ট করার জন্য নিশ্চিত করা
      ];

      /**
       * অ্যাসপেক্ট রেশিও ঠিক রাখার লজিক:
       * - 'scale=1280:-2' মানে হলো উইডথ ১২৮০ হবে এবং হাইট অ্যাসপেক্ট রেশিও অনুযায়ী অটোমেটিক সেট হবে।
       * - '-2' ব্যবহার করা হয়েছে কারণ H.264 কোডেক-এর জন্য হাইট অবশ্যই জোড় সংখ্যা (Even number) হতে হবে।
       */
      if (originalWidth > 1280) {
        // ভিডিওটি যদি ল্যান্ডস্কেপ হয় এবং ১২৮০ এর চেয়ে বড় হয়
        outputOptions.push('-vf', 'scale=1280:-2');
      } else if (originalHeight > 1280) {
        // ভিডিওটি যদি পোর্ট্রেট (যেমন রিলস/শর্টস) হয় এবং হাইট ১২৮০ এর চেয়ে বড় হয়
        outputOptions.push('-vf', 'scale=-2:1280');
      }
      // যদি ভিডিও অলরেডি ১২৮০ বা তার ছোট হয়, তাহলে কোনো স্কেলিং ফিল্টার এড হবে না, লুক সেম থাকবে।

      const ffmpegCommand = ffmpeg(inputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions(outputOptions);

      ffmpegCommand
        .output(outputPath)
        .on('end', async () => {
          try {
            const compressedBuffer = fs.readFileSync(outputPath);

            if (fs.existsSync(inputPath)) await unlinkAsync(inputPath);
            if (fs.existsSync(outputPath)) await unlinkAsync(outputPath);

            resolve({
              buffer: compressedBuffer,
              ext: 'mp4',
              mimetype: 'video/mp4'
            });
          } catch (cleanupError) {
            reject(cleanupError);
          }
        })
        .on('error', async (ffmpegErr: Error) => {
          if (fs.existsSync(inputPath)) await unlinkAsync(inputPath).catch(() => { });
          if (fs.existsSync(outputPath)) await unlinkAsync(outputPath).catch(() => { });
          reject(new InternalServerErrorException(`Video compression failed: ${ffmpegErr.message}`));
        })
        .run();
    });
  });
}

  async uploadFileBuffer(
    fileBuffer: Buffer,
    originalName: string,
    mimetype: string,
  ) {
    if (!fileBuffer || !originalName) {
      throw new BadRequestException('File buffer and original name are required');
    }

    let finalBuffer = fileBuffer;
    let ext = originalName.split('.').pop() || '';
    let finalMimeType = mimetype;
    const fileCategory = this.resolveFileCategory(mimetype);

    if (fileCategory === 'image') {
      finalBuffer = await this.compressImage(fileBuffer);
      ext = 'jpeg';
      finalMimeType = 'image/jpeg';
    } else if (fileCategory === 'video') {
      const videoResult = await this.compressVideo(fileBuffer, originalName);
      finalBuffer = videoResult.buffer;
      ext = videoResult.ext;
      finalMimeType = videoResult.mimetype;
    }
    const cleanOriginalName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
    const baseName = `${Date.now()}-${cleanOriginalName}`;

    const folder = fileCategory === 'image' ? 'images' : fileCategory === 'video' ? 'videos' : 'docs';
    const key = `${folder}/${baseName}.${ext}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: finalBuffer,
          ContentType: finalMimeType,
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException(`Failed to upload file to Cloudflare R2: ${error.message}`);
    }

    const secureUrl = `${this.publicUrl}/${key}`;

    return await this.prisma.fileInstance.create({
      data: {
        filename: `${baseName}.${ext}`,
        originalFilename: originalName,
        path: key,
        url: secureUrl,
        fileType:
          fileCategory === 'image'
            ? FileType.IMAGE
            : fileCategory === 'video'
              ? FileType.VIDEO
              : FileType.DOCS,
        mimeType: finalMimeType,
        size: finalBuffer.length,
      },
    });
  }

  async deleteResource(id: string) {
    const fileOnDb = await this.prisma.fileInstance.findUnique({
      where: { id },
    });

    if (!fileOnDb) {
      throw new BadRequestException('File not available on the server');
    }

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: fileOnDb.path,
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete file from Cloudflare R2: ${error.message}`);
    }

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