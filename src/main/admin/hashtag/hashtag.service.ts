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
  constructor(private prisma: PrismaService) {}

  async createHashtag(dto: CreateHashtagDto, userId: string) {
    const tag = dto.tag.toLowerCase().trim().replace(/^#/, '');

    if (!tag) {
      throw new BadRequestException('Hashtag is required');
    }

    const exists = await this.prisma.hashtag.findUnique({
      where: { tag },
    });

    if (exists) {
      throw new BadRequestException('Hashtag already exists');
    }

    return this.prisma.hashtag.create({
      data: {
        tag,
        description: dto.description,
         createdBy: HashtagCreatedBy.USER,
        createdByUserId: userId,
        isActive: true,
      },
    });
  }

  async updateHashtag(id: string, dto: UpdateHashtagDto, userId: string) {
    const hashtag = await this.prisma.hashtag.findUnique({
      where: { id },
    });

    if (!hashtag) throw new NotFoundException('Hashtag not found');

    if (hashtag.createdByUserId !== userId) {
      throw new BadRequestException('You can update only your own hashtag');
    }

    return this.prisma.hashtag.update({
      where: { id },
      data: dto,
    });
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
