import { PrismaService } from '@/common/prisma/prisma.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
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
        return;

      default:
        return;
    }
  }

  private async handleNewChallenge(data: {
    challengeId: string;
    title: string;
  }) {
    const users = await this.prisma.user.findMany({
      where: {
        deviceTokens: {
          some: {},
        },
      },
    });

    // for (const user of users) {
    //   try {
    //     await this.notificationService.sendNotification({
    //       userId: user.id,
    //       title: 'New Challenge Available',
    //       body: `${data.title} has been created.`,
    //       challengeId: data.challengeId,
    //     });
    //   } catch (error) {
    //     console.error(`Failed to notify user ${user.id}`, error);
    //   }
  }
}
