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
import { UpdateChallengeDto } from './dto/update-challenge.dto';

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


    async listChallenges(params: { status?: string; search?: string; page?: number; limit?: number }) {
    const { status, search, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.isActive = status; // ACTIVE / INACTIVE
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.challenge.findMany({
        where,
        orderBy: { },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          images: true,
          media: true,
          camera: true,
          startDate: true,
          endDate: true,
          isActive: true,
          participants: true,
          hostId: true,
          _count: { select: { participantsList: true } }
        },
      }),
      this.prisma.challenge.count({ where }),
    ]);

    return {
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      items,
    };
  }

  async getChallenge(challengeId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        images: true,
        media: true,
        camera: true,
        startDate: true,
        endDate: true,
        isActive: true,
        participants: true,
        hostId: true,
        host: { select: { id: true, username: true } },
        _count: { select: { participantsList: true } }
      },
    });

    if (!challenge) throw new NotFoundException('Challenge not found');
    return challenge;
  }

  async getParticipants(challengeId: string) {
    const exists = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Challenge not found');

    return this.prisma.challengeParticipant.findMany({
      where: { challengeId, isActive: true },
      orderBy: { joinedAt: 'asc' },
      select: {
        id: true,
        joinedAt: true,
        user: { select: { id: true, username: true} },
      },
    });
  }

  async getSubmissions(challengeId: string) {
    const exists = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Challenge not found');

    // return xPosts of this challenge + likes
    return this.prisma.xPost.findMany({
      where: { challengeId, postType: PostType.Challenge_Post },
      orderBy: [{ like: 'desc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        userId: true,
        mediaUrl: true,
        caption: true,
        like: true,
        createdAt: true,
        user: { select: { id: true, username: true } },
      },
    });
  }

  async getMyChallengeStatus(challengeId: string, userId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { id: true },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');

    const participant = await this.prisma.challengeParticipant.findFirst({
      where: { challengeId, userId, isActive: true },
      select: { id: true, joinedAt: true, isActive: true },
    });

    const submission = await this.prisma.challengeSubmission.findUnique({
      where: { challengeId_userId: { challengeId, userId } },
      select: { id: true, xpostId: true, createdAt: true },
    });

    return {
      joined: !!participant,
      participant,
      submitted: !!submission,
      submission,
    };
  }

  // ---------------- ✅ PATCH METHODS (ADMIN) ----------------

  async updateChallenge(challengeId: string, adminId: string, dto: UpdateChallengeDto) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { id: true, hostId: true },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');

    // if you want only creator-admin can edit:
    if (challenge.hostId !== adminId) {
      throw new ForbiddenException('Only challenge host can update');
    }

    return this.prisma.challenge.update({
      where: { id: challengeId },
      data: {
        title: dto.title,
        description: dto.description,
        location: dto.location,
        images: dto.images,
        media: dto.media,
        camera: dto.camera,
        participants: dto.participants,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async updateChallengeStatus(challengeId: string, adminId: string, isActive: 'ACTIVE' | 'INACTIVE') {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { id: true, hostId: true },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');

    if (challenge.hostId !== adminId) {
      throw new ForbiddenException('Only challenge host can update status');
    }

    return this.prisma.challenge.update({
      where: { id: challengeId },
      data: { isActive },
    });
  }

}
