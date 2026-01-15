import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common'
import { CreateFollowDto, FollowersQueryDto, UnfollowDto } from './dto/create.follow.dto';


@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  async followUser(createFollowDto: CreateFollowDto) {
    const { followerId, followingId } = createFollowDto;

    // Check if trying to follow self
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    // Check if both users exist
    const [follower, following] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: followerId } }),
      this.prisma.user.findUnique({ where: { id: followingId } })
    ]);

    if (!follower) {
      throw new NotFoundException('Follower user not found');
    }

    if (!following) {
      throw new NotFoundException('User to follow not found');
    }

    // Check if already following
    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    if (existingFollow) {
      throw new ConflictException('Already following this user');
    }

    // Create follow relationship
    const follow = await this.prisma.follow.create({
      data: {
        followerId,
        followingId
      },
      include: {
        follower: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        following: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return follow;
  }

  async unfollowUser(unfollowDto: UnfollowDto) {
    const { followerId, followingId } = unfollowDto;

    // Check if follow relationship exists
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    // Delete follow relationship
    await this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    return { message: 'Unfollowed successfully' };
  }

  async getFollowers(userId: string, queryDto: FollowersQueryDto) {
    const { page = 1, limit = 20 } = queryDto;
    const skip = (page - 1) * limit;

    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [followers, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followingId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          follower: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profile: {
                select: {
                  userName: true,
                  imageUrl: true,
                  bio: true
                }
              }
            }
          }
        }
      }),
      this.prisma.follow.count({ where: { followingId: userId } })
    ]);

    return {
      data: followers.map(f => f.follower),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getFollowing(userId: string, queryDto: FollowersQueryDto) {
    const { page = 1, limit = 20 } = queryDto;
    const skip = (page - 1) * limit;

    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [following, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followerId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          following: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profile: {
                select: {
                  userName: true,
                  imageUrl: true,
                  bio: true
                }
              }
            }
          }
        }
      }),
      this.prisma.follow.count({ where: { followerId: userId } })
    ]);

    return {
      data: following.map(f => f.following),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async isFollowing(followerId: string, followingId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    return { isFollowing: !!follow };
  }

  async getFollowCounts(userId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [followersCount, followingCount] = await Promise.all([
      this.prisma.follow.count({ where: { followingId: userId } }),
      this.prisma.follow.count({ where: { followerId: userId } })
    ]);

    return {
      userId,
      followersCount,
      followingCount
    };
  }

  async getMutualFollowers(userId: string, otherUserId: string) {
    // Check if both users exist
    const [user, otherUser] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.user.findUnique({ where: { id: otherUserId } })
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
        select: { followerId: true }
      }),
      this.prisma.follow.findMany({
        where: { followingId: otherUserId },
        select: { followerId: true }
      })
    ]);

    // Find mutual followers
    const userFollowerIds = new Set(userFollowers.map(f => f.followerId));
    const mutualFollowerIds = otherUserFollowers
      .filter(f => userFollowerIds.has(f.followerId))
      .map(f => f.followerId);

    // Get user details for mutual followers
    const mutualFollowers = await this.prisma.user.findMany({
      where: {
        id: { in: mutualFollowerIds }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profile: {
          select: {
            userName: true,
            imageUrl: true,
            bio: true
          }
        }
      }
    });

    return {
      count: mutualFollowers.length,
      users: mutualFollowers
    };
  }

  async removeFollower(userId: string, followerId: string) {
    // Check if follow relationship exists
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userId
        }
      }
    });

    if (!follow) {
      throw new NotFoundException('Follower relationship not found');
    }

    // Remove the follower
    await this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userId
        }
      }
    });

    return { message: 'Follower removed successfully' };
  }
}