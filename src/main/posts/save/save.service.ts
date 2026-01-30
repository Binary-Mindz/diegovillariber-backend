import { PrismaService } from "@/common/prisma/prisma.service";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UnsavePostDto } from "./dto/unsave-post.dto";
import { SavePostDto } from "./dto/save-post.dto";

@Injectable()
export class SaveService {
  constructor(private prisma: PrismaService) {}


  async savePost(userId: string, dto: SavePostDto) {
    const exists = await this.prisma.savePost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: dto.postId,
        },
      },
    });

    if (exists) {
      throw new BadRequestException('Post already saved');
    }

    return this.prisma.savePost.create({
      data: {
        userId,
        postId: dto.postId,
      },
    });
  }


  async unsavePost(userId: string, dto: UnsavePostDto) {
    const saved = await this.prisma.savePost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: dto.postId,
        },
      },
    });

    if (!saved) {
      throw new NotFoundException('Saved post not found');
    }

    await this.prisma.savePost.delete({
      where: {
        userId_postId: {
          userId,
          postId: dto.postId,
        },
      },
    });

    return { removed: true };
  }


  async getMySavedPosts(userId: string) {
    return this.prisma.savePost.findMany({
      where: { userId },
      include: {
        post: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }


  async isPostSaved(userId: string, postId: string) {
    const saved = await this.prisma.savePost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return { isSaved: !!saved };
  }
}