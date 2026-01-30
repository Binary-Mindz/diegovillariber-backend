import { PrismaService } from '@/common/prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateFollowDto,
  FollowersQueryDto,
  UnfollowDto,
} from './dto/create.follow.dto';

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  async followUser(followerId: string, dto: CreateFollowDto) {
    if (followerId === dto.followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const [follower, following] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: followerId } }),
      this.prisma.user.findUnique({ where: { id: dto.followingId } }),
    ]);

    if (!follower) throw new NotFoundException('Follower user not found');
    if (!following) throw new NotFoundException('User to follow not found');

    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: dto.followingId,
        },
      },
    });

    if (existingFollow) {
      throw new ConflictException('Already following this user');
    }

    const FOLLOW_POINTS = 5;

    const result = await this.prisma.$transaction(async (tx) => {
      // 1) create follow
      const follow = await tx.follow.create({
        data: {
          followerId,
          followingId: dto.followingId,
        },
        include: {
          follower: { select: { id: true, username: true, email: true } },
          following: { select: { id: true, username: true, email: true } },
        },
      });

      // 2) increment points for followed user (B)
      await tx.user.update({
        where: { id: dto.followingId },
        data: {
          totalPoints: { increment: FOLLOW_POINTS },
        },
      });

      // 3) point log (optional but recommended)
      await tx.userPoint.create({
        data: {
          userId: dto.followingId, // যাকে follow করা হয়েছে সে points পাবে
          followId: follow.id,
          points: FOLLOW_POINTS,
          // battleId না দিলে error হলে battleId কে optional করতে হবে (উপরে বলা)
        },
      });

      return follow;
    });

    return result;
  }

  //  user unfollow another
  async unfollowUser(
    followerId: string,
    dto: UnfollowDto,
  ): Promise<{ unfollowed: true }> {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: dto.followingId,
        },
      },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    // delete follow relationship
    await this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: dto.followingId,
        },
      },
    });

    return { unfollowed: true };
  }

  async getMyFollowers(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const followers = await this.prisma.follow.findMany({
      where: { followingId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: {
              select: {
                imageUrl: true,
                bio: true,
              },
            },
          },
        },
      },
    });
    return followers.map((f) => f.follower);
  }

  async getMeFollowing(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: {
              select: {
                imageUrl: true,
                bio: true,
              },
            },
          },
        },
      },
    });

    return following.map((f) => f.following);
  }

  async isFollowing(followerId: string, followingId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return { isFollowing: !!follow };
  }

  async getFollowCounts(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [followersCount, followingCount] = await Promise.all([
      this.prisma.follow.count({ where: { followingId: userId } }),
      this.prisma.follow.count({ where: { followerId: userId } }),
    ]);

    return {
      userId,
      followersCount,
      followingCount,
    };
  }

  async getMutualFollowers(userId: string, otherUserId: string) {
    // Check if both users exist
    const [user, otherUser] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.user.findUnique({ where: { id: otherUserId } }),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!otherUser) {
      throw new NotFoundException('Other user not found');
    }

    // Get followers of both users
    const [userFollowers, otherUserFollowers] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followingId: userId },
        select: { followerId: true },
      }),
      this.prisma.follow.findMany({
        where: { followingId: otherUserId },
        select: { followerId: true },
      }),
    ]);

    // Find mutual followers
    const userFollowerIds = new Set(userFollowers.map((f) => f.followerId));
    const mutualFollowerIds = otherUserFollowers
      .filter((f) => userFollowerIds.has(f.followerId))
      .map((f) => f.followerId);

    // Get user details for mutual followers
    const mutualFollowers = await this.prisma.user.findMany({
      where: {
        id: { in: mutualFollowerIds },
      },
      select: {
        id: true,
        username: true,
        email: true,
        profile: {
          select: {
            imageUrl: true,
            bio: true,
          },
        },
      },
    });

    return {
      count: mutualFollowers.length,
      users: mutualFollowers,
    };
  }
}
