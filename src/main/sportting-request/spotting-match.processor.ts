import { PrismaService } from '@/common/prisma/prisma.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SpottingRequestStatus } from 'generated/prisma/enums';
import { SpottingMatcherService } from './spotting-matcher.service';

@Injectable()
@Processor('spotting-match')
export class SpottingMatchProcessor extends WorkerHost {
  private readonly logger = new Logger(SpottingMatchProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly spottingMatcherService: SpottingMatcherService,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    try {
      switch (job.name) {
        case 'process-post':
          return this.handlePostJob(job.data);
        case 'process-request':
          return this.handleRequestJob(job.data);
        default:
          return;
      }
    } catch (error) {
      this.logger.error(
        `Failed to process spotting job ${job.name}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  private async handlePostJob(data: { postId?: string }) {
    if (!data?.postId) {
      return { matched: 0 };
    }

    return this.spottingMatcherService.processNewPost(data.postId);
  }

  private async handleRequestJob(data: { requestId?: string }) {
    if (!data?.requestId) {
      return { matched: 0 };
    }

    const request = await this.prisma.spottingRequest.findUnique({
      where: { id: data.requestId },
      select: {
        id: true,
        userId: true,
        brand: true,
        model: true,
        vehicleType: true,
        latitude: true,
        longitude: true,
        radiusKm: true,
        status: true,
        expiresAt: true,
        lastMatchedAt: true,
      },
    });

    if (!request) {
      return { matched: 0 };
    }

    if (request.status !== SpottingRequestStatus.ACTIVE) {
      return { matched: 0 };
    }

    return this.spottingMatcherService.matchExistingPosts(request as any);
  }
}
