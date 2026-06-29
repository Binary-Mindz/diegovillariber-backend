import { PrismaService } from '@/common/prisma/prisma.service';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { FileType } from 'generated/prisma/enums';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

// FFmpeg এর এক্সিকিউটেবল পাথ সেট করা
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
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

  // ইমেজ কম্প্রেস এবং রিসাইজ (Production-Optimized)
  private async compressImage(buffer: Buffer): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .resize({ width: 1280, withoutEnlargement: true }) // রেজোলিউশন কমানো (max width 1280px)
        .jpeg({ quality: 80, progressive: true, mozjpeg: true }) // ৮১% কোয়ালিটি + বেস্ট কম্প্রেশন অ্যালগরিদম
        .toBuffer();
    } catch (error) {
      throw new InternalServerErrorException(`Image optimization failed: ${error.message}`);
    }
  }

  // ভিডিও কম্প্রেস এবং রেজোলিউশন ডাউনস্কেল (Production-Optimized)
  private async compressVideo(fileBuffer: Buffer, originalName: string): Promise<{ buffer: Buffer; ext: string; mimetype: string }> {
    // প্রজেক্ট রুট বা ডিস্ট ফোল্ডারে নিরাপদ টেম্প ডিরেক্টরি তৈরি
    const tempDir = path.join(process.cwd(), 'temp-uploads');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, '_');
    const inputPath = path.join(tempDir, `in_${Date.now()}_${sanitizedName}`);
    const outputPath = path.join(tempDir, `out_${Date.now()}.mp4`);

    // অরিজিনাল বাফার ফাইলে রাইট করা
    await writeFileAsync(inputPath, fileBuffer);

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .size('1280x720') // রেজোলিউশন কমিয়ে 720p (HD) করা
        .videoCodec('libx264') // স্ট্যান্ডার্ড ও হাইলি কম্প্রেসড কোডেক
        .audioCodec('aac')
        .outputOptions([
          '-crf 28', // সাইজ ও কোয়ালিটির পারফেক্ট ব্যালেন্স
          '-preset fast'
        ])
        .output(outputPath)
        .on('end', async () => {
          try {
            const compressedBuffer = fs.readFileSync(outputPath);
            
            // ক্লিনআপ: প্রসেস শেষ হলে ফাইল রিমুভ করা
            if (fs.existsSync(inputPath)) await unlinkAsync(inputPath);
            if (fs.existsSync(outputPath)) await unlinkAsync(outputPath);

            resolve({
              buffer: compressedBuffer,
              ext: 'mp4',
              mimetype: 'video/mp4'
            });
          } catch (err) {
            reject(err);
          }
        })
        .on('error', async (err: Error) => {
          // ক্লিনআপ: এরর খেলেও যাতে টেম্প ফাইল ডিলিট হয়
          if (fs.existsSync(inputPath)) await unlinkAsync(inputPath).catch(() => {});
          if (fs.existsSync(outputPath)) await unlinkAsync(outputPath).catch(() => {});
          reject(new InternalServerErrorException(`Video compression failed: ${err.message}`));
        })
        .run();
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

    // ফাইল ক্যাটাগরি অনুযায়ী প্রসেসিং করা
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

    // ফাইলের নাম ক্লিন করা (স্পেস ও স্পেশাল ক্যারেক্টার রিমুভ)
    const cleanOriginalName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
    const baseName = `${Date.now()}-${cleanOriginalName}`;
    
    const folder = fileCategory === 'image' ? 'images' : fileCategory === 'video' ? 'videos' : 'docs';
    const key = `${folder}/${baseName}.${ext}`;

    // Cloudflare R2 তে আপলোড
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

    // ডাটাবেজে রেকর্ড সেভ করা
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