import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RepostPostDto } from './dto/repost-post.dto';
import { UnrepostPostDto } from './dto/unrepost-post.dto';

@Injectable()
export class RepostService {
  constructor(private readonly prisma: PrismaService) {}

  async repostPost(userId: string, dto: RepostPostDto) {
    const { postId } = dto;

    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        userId: true,
        caption: true,
        mediaUrl: true,
        repost: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingRepost = await this.prisma.repost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingRepost) {
      throw new BadRequestException('You already reposted this post');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const repost = await tx.repost.create({
        data: {
          userId,
          postId,
        },
      });

      const updatedPost = await tx.post.update({
        where: { id: postId },
        data: {
          repost: {
            increment: 1,
          },
        },
        select: {
          id: true,
          repost: true,
        },
      });

      return {
        repost,
        post: updatedPost,
      };
    });

    return {
      reposted: true,
      repostId: result.repost.id,
      postId: result.post.id,
      repostCount: result.post.repost,
      point: result.repost.point,
      createdAt: result.repost.createdAt,
    };
  }

  async unrepostPost(userId: string, dto: UnrepostPostDto) {
    const { postId } = dto;

    const existingRepost = await this.prisma.repost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      select: {
        id: true,
        postId: true,
      },
    });

    if (!existingRepost) {
      throw new NotFoundException('Repost not found for this post');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.repost.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      const updatedPost = await tx.post.update({
        where: { id: postId },
        data: {
          repost: {
            decrement: 1,
          },
        },
        select: {
          id: true,
          repost: true,
        },
      });

      return updatedPost;
    });

    return {
      reposted: false,
      postId: result.id,
      repostCount: result.repost,
    };
  }

 async getMyReposts(userId: string) {
  const reposts = await this.prisma.repost.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      point: true,
      createdAt: true,
      post: {
        select: {
          id: true,
          caption: true,
          mediaUrl: true,
          postType: true,
          mediaType: true,
          postLocation: true,
          locationName: true,
          createdAt: true,
          repost: true,
          like: true,
          comment: true,
          share: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          profile: {
            select: {
              id: true,
              profileName: true,
              imageUrl: true,
            },
          },
          car: {
            select: {
              id: true,
              model: true
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
              reposts: true,
            },
          },
        },
      },
    },
  });

  return reposts.map((item) => {
    const post = item.post;

    return {
      repostId: item.id,
      point: item.point,
      createdAt: item.createdAt,
      post: {
        id: post.id,
        caption: post.caption,
        mediaUrl: post.mediaUrl,
        postType: post.postType,
        mediaType: post.mediaType,
        postLocation: post.postLocation,
        locationName: post.locationName,
        createdAt: post.createdAt,
        repostCount: post.repost,
        likeCount: post.like,
        commentCount: post.comment,
        shareCount: post.share,
        user: post.user,
        profile: post.profile,
        car: post.car,
        counts: post._count,
      },
    };
  });
}

  async isPostReposted(userId: string, postId: string) {
    const repost = await this.prisma.repost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return {
      isReposted: !!repost,
      repostId: repost?.id ?? null,
      createdAt: repost?.createdAt ?? null,
    };
  }
}