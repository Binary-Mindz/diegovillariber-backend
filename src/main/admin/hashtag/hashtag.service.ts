import { PrismaService } from '@/common/prisma/prisma.service';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';
import { HashtagQueryDto } from './dto/hashtag-query.dto';
import { HashtagCreatedBy } from '../../../../prisma/generated/prisma/enums';

@Injectable()
export class HashtagService {
  constructor(private prisma: PrismaService) { }

  async createHashtag(dto: CreateHashtagDto, userId: string) {
    const normalizedTag = dto.tag?.toLowerCase().trim().replace(/^#/, '');

    if (!normalizedTag || normalizedTag.includes(' ')) {
      throw new BadRequestException('Invalid hashtag format.');
    }

    try {
      return await this.prisma.hashtag.create({
        data: {
          tag: normalizedTag,
          description: dto.description,
          createdBy: HashtagCreatedBy.USER,
          createdByUserId: userId,
          isActive: true,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        const existing = await this.prisma.hashtag.findUnique({ where: { tag: normalizedTag } });
        if (existing && !existing.isActive) {
          return this.prisma.hashtag.update({
            where: { id: existing.id },
            data: { isActive: true },
          });
        }
        throw new BadRequestException(`Hashtag '#${normalizedTag}' already exists.`);
      }
      throw error;
    }
  }

  async updateHashtag(id: string, dto: UpdateHashtagDto, userId: string) {
    const hashtag = await this.prisma.hashtag.findUnique({
      where: { id },
    });

    if (!hashtag) {
      throw new NotFoundException('Hashtag not found');
    }

    if (hashtag.createdByUserId !== userId) {
      throw new BadRequestException('You can update only your own hashtag');
    }

    const updateData: any = { ...dto };
    const inputTag = (dto as any).tag;

    if (inputTag) {
      const normalizedTag = inputTag.toLowerCase().trim().replace(/^#/, '');

      if (!normalizedTag || normalizedTag.includes(' ')) {
        throw new BadRequestException('Invalid hashtag format. Spaces are not allowed.');
      }

      const tagConflict = await this.prisma.hashtag.findFirst({
        where: {
          tag: normalizedTag,
          id: { not: id },
        },
      });

      if (tagConflict) {
        throw new BadRequestException(`The hashtag '#${normalizedTag}' is already taken by another record.`);
      }

      updateData.tag = normalizedTag;
    }

    try {
      return await this.prisma.hashtag.update({
        where: { id },
        data: updateData,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Hashtag text must be unique.');
      }
      throw error;
    }
  }

  async deleteHashtag(id: string, userId: string) {
    const hashtag = await this.prisma.hashtag.findUnique({
      where: { id },
    });

    if (!hashtag) {
      throw new NotFoundException('Hashtag not found');
    }

    if (hashtag.createdByUserId !== userId) {
      throw new BadRequestException('You can delete only your own hashtag');
    }

    await this.prisma.hashtag.delete({
      where: { id },
    });

    return {
      id,
      deleted: true,
    };
  }

  // ============ USER ============

  async getHashtags(query: HashtagQueryDto) {
    const { search } = query;

    return this.prisma.hashtag.findMany({
      where: {
        isActive: true,
        ...(search && {
          tag: {
            contains: search.toLowerCase(),
            mode: 'insensitive',
          },
        }),
      },
      orderBy: {
        usageCount: 'desc',
      },
      take: 20,
    });
  }

  async getTrendingHashtags() {
    return this.prisma.hashtag.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        usageCount: 'desc',
      },
      take: 10,
    });
  }

  // ============ POST CREATE TIME ============

  async validateAndConnectHashtags(tags: string[]) {
    const hashtags = await this.prisma.hashtag.findMany({
      where: {
        tag: { in: tags.map((t) => t.toLowerCase()) },
        isActive: true,
      },
    });

    if (hashtags.length !== tags.length) {
      throw new BadRequestException('Invalid or inactive hashtag used');
    }

    await this.prisma.hashtag.updateMany({
      where: { id: { in: hashtags.map((h) => h.id) } },
      data: {
        usageCount: { increment: 1 },
      },
    });

    return hashtags.map((h) => ({ id: h.id }));
  }
}
