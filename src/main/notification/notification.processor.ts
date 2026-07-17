import { PrismaService } from '@/common/prisma/prisma.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  NotificationChannel,
  NotificationEntityType,
  NotificationType,
} from 'generated/prisma/client';
import { NotificationService } from './notification.service';

@Processor('notification')
export class NotificationProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    switch (job.name) {
      case 'new-challenge':
        return this.handleNewChallenge(job.data);
      case 'challenge-completed':
        return this.handleChallengeCompleted(job.data);
      case 'challenge-activated':
        return this.handleChallengeActivated(job.data);
      case 'raw-shift-completed':
        return this.handleRawShiftCompleted(job.data);
      case 'head-to-head-activated':
        return this.handleHeadToHeadActivated(job.data);
      case 'head-to-head-completed':
        return this.handleHeadToHeadCompleted(job.data);
      default:
        return;
    }
  }

  private async handleNewChallenge(data: {
    challengeId: string;
    title: string;
  }) {
    const batchSize = 200;
    let lastId: string | undefined;

    while (true) {
      const users = await this.prisma.user.findMany({
        where: {
          accountStatus: 'ACTIVE',
        },
        select: { id: true },
        orderBy: { id: 'asc' },
        ...(lastId
          ? {
              cursor: { id: lastId },
              skip: 1,
            }
          : {}),
        take: batchSize,
      });

      if (users.length === 0) {
        break;
      }

      for (const user of users) {
        try {
          await this.notificationService.sendNotification({
            userId: user.id,
            type: NotificationType.CHALLENGE_INVITE,
            channel: NotificationChannel.PUSH,
            title: 'New Challenge Available',
            message: `${data.title} has been created. Join now!`,
            deepLink: `/challenges/${data.challengeId}`,
            entityType: NotificationEntityType.CHALLENGE,
            entityId: data.challengeId,
            meta: {
              challengeId: data.challengeId,
            },
          });
        } catch (error) {
          console.error(`Failed to notify user ${user.id}`, error);
        }
      }

      lastId = users[users.length - 1].id;
    }
  }

  private async handleChallengeActivated(data: {
    challengeId: string;
    title: string;
  }) {
    const batchSize = 200;
    let lastId: string | undefined;

    while (true) {
      const users = await this.prisma.user.findMany({
        where: {
          accountStatus: 'ACTIVE',
        },
        select: { id: true },
        orderBy: { id: 'asc' },
        ...(lastId
          ? {
              cursor: { id: lastId },
              skip: 1,
            }
          : {}),
        take: batchSize,
      });

      if (users.length === 0) {
        break;
      }

      for (const user of users) {
        try {
          await this.notificationService.sendNotification({
            userId: user.id,
            type: NotificationType.CHALLENGE_INVITE,
            channel: NotificationChannel.PUSH,
            title: 'Challenge Activated!',
            message: `The challenge "${data.title}" is now active. Join now!`,
            deepLink: `/challenges/${data.challengeId}`,
            entityType: NotificationEntityType.CHALLENGE,
            entityId: data.challengeId,
            meta: {
              challengeId: data.challengeId,
            },
          });
        } catch (error) {
          console.error(`Failed to notify user ${user.id}`, error);
        }
      }

      lastId = users[users.length - 1].id;
    }
  }

  private async handleChallengeCompleted(data: {
    challengeId: string;
    title: string;
    winnerIds: string[];
  }) {
    if (!data.winnerIds || !Array.isArray(data.winnerIds)) return;

    for (const winnerId of data.winnerIds) {
      try {
        await this.notificationService.sendNotification({
          userId: winnerId,
          type: NotificationType.CHALLENGE_RESULT,
          channel: NotificationChannel.IN_APP,
          title: 'Congratulations!',
          message: `You are a winner in the challenge "${data.title}"!`,
          deepLink: `/challenges/${data.challengeId}`,
          entityType: NotificationEntityType.CHALLENGE,
          entityId: data.challengeId,
          meta: {
            challengeId: data.challengeId,
          },
        });
      } catch (error) {
        console.error(`Failed to notify challenge winner ${winnerId}`, error);
      }
    }
  }

  private async handleRawShiftCompleted(data: {
    battleId: string;
    title: string;
    winnerId: string;
  }) {
    if (!data.winnerId) return;

    try {
      await this.notificationService.sendNotification({
        userId: data.winnerId,
        type: NotificationType.BATTLE_RESULT,
        channel: NotificationChannel.IN_APP,
        title: 'Raw Shift Victory!',
        message: `Congratulations! You won the raw shift battle "${data.title}"!`,
        deepLink: `/raw-shifts/${data.battleId}`,
        entityType: NotificationEntityType.BATTLE,
        entityId: data.battleId,
        meta: {
          battleId: data.battleId,
        },
      });
    } catch (error) {
      console.error(`Failed to notify raw shift winner ${data.winnerId}`, error);
    }
  }

  private async handleHeadToHeadActivated(data: {
    battleId: string;
    title: string;
  }) {
    const batchSize = 200;
    let lastId: string | undefined;

    while (true) {
      const users = await this.prisma.user.findMany({
        where: {
          accountStatus: 'ACTIVE',
        },
        select: { id: true },
        orderBy: { id: 'asc' },
        ...(lastId
          ? {
              cursor: { id: lastId },
              skip: 1,
            }
          : {}),
        take: batchSize,
      });

      if (users.length === 0) {
        break;
      }

      for (const user of users) {
        try {
          await this.notificationService.sendNotification({
            userId: user.id,
            type: NotificationType.BATTLE_INVITE, // Or a suitable type for 'battle activated'
            channel: NotificationChannel.PUSH,
            title: 'Head-to-Head Battle Activated!',
            message: `The head-to-head battle "${data.title}" is now active. Join now!`,
            deepLink: `/head-to-head/${data.battleId}`,
            entityType: NotificationEntityType.BATTLE,
            entityId: data.battleId,
            meta: {
              battleId: data.battleId,
            },
          });
        } catch (error) {
          console.error(`Failed to notify user ${user.id}`, error);
        }
      }

      lastId = users[users.length - 1].id;
    }
  }

  private async handleHeadToHeadCompleted(data: {
    battleId: string;
    title: string;
    winnerId: string;
  }) {
    if (!data.winnerId) return;

    try {
      await this.notificationService.sendNotification({
        userId: data.winnerId,
        type: NotificationType.BATTLE_RESULT,
        channel: NotificationChannel.IN_APP,
        title: 'Head-to-Head Victory!',
        message: `Congratulations! You won the head-to-head battle "${data.title}"!`,
        deepLink: `/head-to-head/${data.battleId}`,
        entityType: NotificationEntityType.BATTLE,
        entityId: data.battleId,
        meta: {
          battleId: data.battleId,
        },
      });
    } catch (error) {
      console.error(`Failed to notify head-to-head winner ${data.winnerId}`, error);
    }
  }
}
