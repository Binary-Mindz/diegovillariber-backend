import { PrismaService } from '@/common/prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';


@Injectable()
export class UserBlockService {
  constructor(private readonly prisma: PrismaService) {}

  async blockUser(userId: string, targetUserId: string, reason?: string) {
    if (userId === targetUserId) {
      throw new BadRequestException('You cannot block yourself');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    const existing = await this.prisma.userBlock.findUnique({
      where: {
        blockerId_blockedUserId: {
          blockerId: userId,
          blockedUserId: targetUserId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('User already blocked');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const block = await tx.userBlock.create({
        data: {
          blockerId: userId,
          blockedUserId: targetUserId,
          reason,
        },
      });

      // optional: remove follow relation both directions
      await tx.follow.deleteMany({
        where: {
          OR: [
            {
              followerId: userId,
              followingId: targetUserId,
            },
            {
              followerId: targetUserId,
              followingId: userId,
            },
          ],
        },
      });

      return block;
    });

    return result;
  }

  async unblockUser(userId: string, targetUserId: string) {
    const existing = await this.prisma.userBlock.findUnique({
      where: {
        blockerId_blockedUserId: {
          blockerId: userId,
          blockedUserId: targetUserId,
        },
      },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Blocked user record not found');
    }

    await this.prisma.userBlock.delete({
      where: {
        blockerId_blockedUserId: {
          blockerId: userId,
          blockedUserId: targetUserId,
        },
      },
    });

    return null;
  }

  async getMyBlockedUsers(userId: string) {
    const blocks = await this.prisma.userBlock.findMany({
      where: {
        blockerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        blockedUser: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                id: true,
                profileName: true,
                imageUrl: true,
                accountType: true,
              },
            },
          },
        },
      },
    });

    return blocks.map((item) => ({
      id: item.id,
      reason: item.reason,
      createdAt: item.createdAt,
      user: {
        id: item.blockedUser.id,
        email: item.blockedUser.email,
        profile: item.blockedUser.profile?.[0]
          ? {
              id: item.blockedUser.profile[0].id,
              profileName: item.blockedUser.profile[0].profileName,
              imageUrl: item.blockedUser.profile[0].imageUrl,
              accountType: item.blockedUser.profile[0].accountType,
            }
          : null,
      },
    }));
  }

  async getBlockStatus(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      return {
        blockedByMe: false,
        blockedMe: false,
        eitherBlocked: false,
      };
    }

    const [blockedByMe, blockedMe] = await Promise.all([
      this.prisma.userBlock.findUnique({
        where: {
          blockerId_blockedUserId: {
            blockerId: userId,
            blockedUserId: targetUserId,
          },
        },
        select: { id: true },
      }),
      this.prisma.userBlock.findUnique({
        where: {
          blockerId_blockedUserId: {
            blockerId: targetUserId,
            blockedUserId: userId,
          },
        },
        select: { id: true },
      }),
    ]);

    return {
      blockedByMe: !!blockedByMe,
      blockedMe: !!blockedMe,
      eitherBlocked: !!blockedByMe || !!blockedMe,
    };
  }

  async ensureUsersNotBlocked(userId: string, targetUserId: string) {
    const block = await this.prisma.userBlock.findFirst({
      where: {
        OR: [
          {
            blockerId: userId,
            blockedUserId: targetUserId,
          },
          {
            blockerId: targetUserId,
            blockedUserId: userId,
          },
        ],
      },
      select: {
        id: true,
        blockerId: true,
        blockedUserId: true,
      },
    });

    if (block) {
      throw new ForbiddenException(
        'Action not allowed because one of the users has blocked the other',
      );
    }
  }

  async getExcludedUserIds(userId: string): Promise<string[]> {
    const blocks = await this.prisma.userBlock.findMany({
      where: {
        OR: [
          { blockerId: userId },
          { blockedUserId: userId },
        ],
      },
      select: {
        blockerId: true,
        blockedUserId: true,
      },
    });

    const ids = new Set<string>();

    for (const item of blocks) {
      if (item.blockerId !== userId) ids.add(item.blockerId);
      if (item.blockedUserId !== userId) ids.add(item.blockedUserId);
    }

    return [...ids];
  }
}