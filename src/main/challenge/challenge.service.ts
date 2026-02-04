import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { SubmitChallengePostDto } from './dto/submit-challenge-post.dto';
import { PostType } from 'generated/prisma/enums';

@Injectable()
export class ChallengeService {
  constructor(private readonly prisma: PrismaService) {}

  async createChallenge(adminUserId: string, dto: CreateChallengeDto) {
    return this.prisma.challenge.create({
      data: {
        hostId: adminUserId,
        title: dto.title,
        description: dto.description ?? null,
        location: dto.location ?? null,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        images: dto.images ?? null,
        media: dto.media ?? null,
        camera: dto.camera ?? null,
        participants: dto.participants ?? 10,
      },
    });
  }

  async joinChallenge(challengeId: string, userId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
      select: {
        id: true,
        isActive: true,
        participants: true,
        _count: { select: { participantsList: true } },
      },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');
    if (challenge.isActive !== 'ACTIVE') {
      throw new BadRequestException('Challenge is not active');
    }
    if (challenge._count.participantsList >= challenge.participants) {
      throw new BadRequestException('Challenge is full');
    }

    try {
      return await this.prisma.challengeParticipant.create({
        data: {
          challengeId,
          userId,
          joinedAt: new Date(),
          isActive: true,
        },
      });
    } catch (e: any) {
      throw new BadRequestException('Already joined');
    }
  }

  async submitChallengePost(userId: string, dto: SubmitChallengePostDto) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: dto.challengeId },
      select: { id: true, isActive: true },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');
    if (challenge.isActive !== 'ACTIVE') {
      throw new BadRequestException('Challenge is not active');
    }

    const participant = await this.prisma.challengeParticipant.findFirst({
      where: {
        challengeId: dto.challengeId,
        userId,
        isActive: true,
      },
      select: { id: true },
    });
    if (!participant) {
      throw new ForbiddenException('You are not a participant of this challenge');
    }

    return this.prisma.$transaction(async (tx) => {
      const alreadySubmitted = await tx.challengeSubmission.findUnique({
        where: {
          challengeId_userId: {
            challengeId: dto.challengeId,
            userId,
          },
        },
        select: { id: true },
      });
      if (alreadySubmitted) {
        throw new BadRequestException('You already submitted in this challenge');
      }

      const xpost = await tx.xPost.create({
        data: {
          userId,
          postType: PostType.Challenge_Post,

          challengeId: dto.challengeId,
          challengeParticipantId: participant.id,

          mediaUrl: dto.mediaUrl ?? null,
          caption: dto.caption ?? null,
        },
      });

      await tx.challengeSubmission.create({
        data: {
          challengeId: dto.challengeId,
          userId,
          xpostId: xpost.id,
        },
      });

      return xpost;
    });
  }

  async finalizeChallenge(challengeId: string, adminId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { id: true },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');

    const existingResult = await this.prisma.challengeResult.findUnique({
      where: { challengeId },
      select: { id: true },
    });
    if (existingResult) throw new BadRequestException('Challenge already finalized');
    const top = await this.prisma.xPost.findFirst({
      where: {
        challengeId,
        postType: PostType.Challenge_Post,
      },
      orderBy: [{ like: 'desc' }, { createdAt: 'asc' }],
      select: { id: true, userId: true, like: true },
    });

    if (!top) throw new BadRequestException('No submissions found');

    const result = await this.prisma.challengeResult.create({
      data: {
        challengeId,
        winnerUserId: top.userId,
      },
    });

    return {
      result,
      winnerXPostId: top.id,
      likes: top.like,
    };
  }
}
