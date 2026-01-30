import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { HidePostDto } from './dto/hide-post.dto';
import { UnhidePostDto } from './dto/unhide-post.dto';

@Injectable()
export class HideService {
  constructor(private prisma: PrismaService) {}

  // Hide post
  async hidePost(userId: string, dto: HidePostDto) {
    const exists = await this.prisma.hidePost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: dto.postId,
        },
      },
    });

    if (exists) {
      throw new BadRequestException('Post already hidden');
    }

    return this.prisma.hidePost.create({
      data: {
        userId,
        postId: dto.postId,
      },
    });
  }

  // Unhide post
  async unhidePost(userId: string, dto: UnhidePostDto) {
    const hidden = await this.prisma.hidePost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: dto.postId,
        },
      },
    });

    if (!hidden) {
      throw new NotFoundException('Hidden post not found');
    }

    await this.prisma.hidePost.delete({
      where: {
        userId_postId: {
          userId,
          postId: dto.postId,
        },
      },
    });

    return { unhidden: true };
  }

  // Get my hidden posts
  async getMyHiddenPosts(userId: string) {
    return this.prisma.hidePost.findMany({
      where: { userId },
      include: {
        post: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Check hidden
  async isPostHidden(userId: string, postId: string) {
    const hidden = await this.prisma.hidePost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return { isHidden: !!hidden };
  }
}
