// src/head-to-head/head-to-head.service.ts
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';


import { HeadToHeadQueryDto } from './dto/headtohead-query.dto';
import { CreateHeadToHeadBattleDto } from './dto/create-headtohead-battle.dto';
import { UpdateHeadToHeadBattleDto } from './dto/update-headtohead-battle.dto';
import { InviteHeadToHeadDto } from './dto/invite-headtohead.dto';
import { RespondInvitationDto } from './dto/respond-invitation.dto';
import { SubmitHeadToHeadDto } from './dto/submit-headtohead.dto';
import { VoteHeadToHeadDto } from './dto/vote-headtohead.dto';
import { CreateHeadToHeadCommentDto } from './dto/comment-headtohead.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { BattleAccessType, BattleStatus, InvitationStatus, ParticipantStatus, SubmissionStatus } from 'generated/prisma/enums';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class HeadToHeadService {
  constructor(private readonly prisma: PrismaService) {}

  private now() {
    return new Date();
  }

  async listBattles(query: HeadToHeadQueryDto) {
    const now = this.now();

    const where: Prisma.HeadToHeadBattleWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.mediaType ? { mediaType: query.mediaType } : {}),
      ...(query.accessType ? { accessType: query.accessType } : {}),
      ...(query.creatorId ? { creatorId: query.creatorId } : {}),
      ...(query.q
        ? {
            OR: [
              { title: { contains: query.q, mode: 'insensitive' } },
              { description: { contains: query.q, mode: 'insensitive' } },
              { locationName: { contains: query.q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    // Tabs: active/upcoming/finished
    if (query.tab === 'ACTIVE') {
      where.startDate = { lte: now };
      where.endDate = { gte: now };
      where.status = query.status ?? BattleStatus.RUNNING;
    } else if (query.tab === 'UPCOMING') {
      where.startDate = { gt: now };
      where.status = query.status ?? BattleStatus.PUBLISHED;
    } else if (query.tab === 'FINISHED') {
      where.OR = [
        ...(where.OR ?? []),
        { endDate: { lt: now } },
        { status: BattleStatus.COMPLETED },
        { status: BattleStatus.CANCELLED },
      ];
    }

    return this.prisma.headToHeadBattle.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      take: Math.min(query.limit ?? 20, 50),
      skip: query.offset ?? 0,
      include: {
        creator: { select: { id: true, email: true } },
        _count: { select: { participants: true, submissions: true, battleComments: true, battleVotes: true } },
      },
    });
  }

  async getBattle(id: string) {
    const battle = await this.prisma.headToHeadBattle.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, email: true } },
        winnerUser: { select: { id: true, email: true } },
        participants: {
          orderBy: { joinedAt: 'asc' },
          include: { user: { select: { id: true, email: true } } },
        },
        submissions: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, email: true } },
            votes: true,
            comments: { include: { user: { select: { id: true, email: true } } } },
            _count: { select: { votes: true, comments: true } },
          },
        },
        invitations: {
          orderBy: { sentAt: 'desc' },
          include: {
            inviter: { select: { id: true, email: true } },
            invitee: { select: { id: true, email: true } },
          },
        },
        battleComments: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { id: true, email: true } } },
          take: 50,
        },
        _count: { select: { participants: true, submissions: true, invitations: true } },
      },
    });

    if (!battle) throw new NotFoundException('Battle not found');
    return battle;
  }

  async createBattle(creatorId: string, dto: CreateHeadToHeadBattleDto) {
    if (dto.startDate >= dto.endDate) throw new BadRequestException('startDate must be before endDate');

    if (dto.accessType === BattleAccessType.AUTO_INVITE) {
      if (!dto.autoInviteScope || !dto.autoInviteCount) {
        throw new BadRequestException('autoInviteScope and autoInviteCount are required when accessType = AUTO_INVITE');
      }
    }

    const battle = await this.prisma.headToHeadBattle.create({
      data: {
        creatorId,
        title: dto.title,
        description: dto.description,
        mediaType: dto.mediaType,
        coverImage: dto.coverImage,

        cameraRequirement: dto.cameraRequirement,
        requireTrueShotVerified: dto.requireTrueShotVerified ?? false,
        rejectEditedPhotos: dto.rejectEditedPhotos ?? false,

        accessType: dto.accessType,
        autoInviteScope: dto.autoInviteScope,
        autoInviteCount: dto.autoInviteCount,

        participationScope: dto.participationScope,
        radiusKm: dto.radiusKm,
        locationName: dto.locationName,
        latitude: dto.latitude,
        longitude: dto.longitude,
        placeId: dto.placeId,

        startDate: dto.startDate,
        endDate: dto.endDate,
        durationDays: dto.durationDays,

        status: dto.status ?? BattleStatus.DRAFT,

        // optional: auto-join creator as participant
        participants: { create: { userId: creatorId, status: ParticipantStatus.JOINED } },
      },
    });

    // NOTE: If you want system auto-invite logic, implement in a cron/queue worker.
    return battle;
  }

  async updateBattle(id: string, userId: string, dto: UpdateHeadToHeadBattleDto) {
    const battle = await this.prisma.headToHeadBattle.findUnique({ where: { id } });
    if (!battle) throw new NotFoundException('Battle not found');
    if (battle.creatorId !== userId) throw new ForbiddenException('Only creator can update');

    if (dto.startDate && dto.endDate && dto.startDate >= dto.endDate) {
      throw new BadRequestException('startDate must be before endDate');
    }

    return this.prisma.headToHeadBattle.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.mediaType !== undefined ? { mediaType: dto.mediaType } : {}),
        ...(dto.coverImage !== undefined ? { coverImage: dto.coverImage } : {}),

        ...(dto.cameraRequirement !== undefined ? { cameraRequirement: dto.cameraRequirement } : {}),
        ...(dto.requireTrueShotVerified !== undefined ? { requireTrueShotVerified: dto.requireTrueShotVerified } : {}),
        ...(dto.rejectEditedPhotos !== undefined ? { rejectEditedPhotos: dto.rejectEditedPhotos } : {}),

        ...(dto.accessType !== undefined ? { accessType: dto.accessType } : {}),
        ...(dto.autoInviteScope !== undefined ? { autoInviteScope: dto.autoInviteScope } : {}),
        ...(dto.autoInviteCount !== undefined ? { autoInviteCount: dto.autoInviteCount } : {}),

        ...(dto.participationScope !== undefined ? { participationScope: dto.participationScope } : {}),
        ...(dto.radiusKm !== undefined ? { radiusKm: dto.radiusKm } : {}),
        ...(dto.locationName !== undefined ? { locationName: dto.locationName } : {}),
        ...(dto.latitude !== undefined ? { latitude: dto.latitude } : {}),
        ...(dto.longitude !== undefined ? { longitude: dto.longitude } : {}),
        ...(dto.placeId !== undefined ? { placeId: dto.placeId } : {}),

        ...(dto.startDate !== undefined ? { startDate: dto.startDate } : {}),
        ...(dto.endDate !== undefined ? { endDate: dto.endDate } : {}),
        ...(dto.durationDays !== undefined ? { durationDays: dto.durationDays } : {}),

        ...(dto.status !== undefined ? { status: dto.status } : {}),
      },
    });
  }

  async deleteBattle(id: string, userId: string) {
    const battle = await this.prisma.headToHeadBattle.findUnique({ where: { id } });
    if (!battle) throw new NotFoundException('Battle not found');
    if (battle.creatorId !== userId) throw new ForbiddenException('Only creator can delete');

    // Hard delete (your schema uses cascade)
    await this.prisma.headToHeadBattle.delete({ where: { id } });
    return true;
  }

  async joinBattle(battleId: string, userId: string) {
    const battle = await this.prisma.headToHeadBattle.findUnique({
      where: { id: battleId },
      include: { invitations: { where: { inviteeId: userId } } },
    });
    if (!battle) throw new NotFoundException('Battle not found');

    // Access rules
    if (battle.accessType === BattleAccessType.INVITATION_ONLY) {
      const inv = battle.invitations?.[0];
      if (!inv || inv.status !== InvitationStatus.ACCEPTED) {
        throw new ForbiddenException('Invitation required (and must be accepted) to join this battle');
      }
    }

    if (battle.accessType === BattleAccessType.FOLLOWERS_ONLY) {
      // NOTE: you can enforce this if your Follow model exists.
      // Throwing for safety so you don’t accidentally expose private battles.
      throw new ForbiddenException('FOLLOWERS_ONLY access requires follower check implementation');
    }

    // OPEN & AUTO_INVITE: allow join
    const participant = await this.prisma.battleParticipant.upsert({
      where: { battleId_userId: { battleId, userId } },
      update: { status: ParticipantStatus.JOINED },
      create: { battleId, userId, status: ParticipantStatus.JOINED },
    });

    return participant;
  }

  async inviteUser(battleId: string, inviterId: string, dto: InviteHeadToHeadDto) {
    const battle = await this.prisma.headToHeadBattle.findUnique({ where: { id: battleId } });
    if (!battle) throw new NotFoundException('Battle not found');
    if (battle.creatorId !== inviterId) throw new ForbiddenException('Only creator can invite');

    if (dto.inviteeId === inviterId) throw new BadRequestException('Cannot invite yourself');

    // Upsert invitation: if exists, reset to pending
    return this.prisma.battleInvitation.upsert({
      where: { battleId_inviteeId: { battleId, inviteeId: dto.inviteeId } },
      update: { status: InvitationStatus.PENDING, respondedAt: null },
      create: {
        battleId,
        inviterId,
        inviteeId: dto.inviteeId,
        status: InvitationStatus.PENDING,
      },
    });
  }

  async respondInvitation(invitationId: string, userId: string, dto: RespondInvitationDto) {
    const inv = await this.prisma.battleInvitation.findUnique({ where: { id: invitationId } });
    if (!inv) throw new NotFoundException('Invitation not found');
    if (inv.inviteeId !== userId) throw new ForbiddenException('Only invitee can respond');

    const next = dto.status;

    const updated = await this.prisma.battleInvitation.update({
      where: { id: invitationId },
      data: { status: next, respondedAt: new Date() },
    });

    // if accepted, auto join
    if (next === InvitationStatus.ACCEPTED) {
      await this.prisma.battleParticipant.upsert({
        where: { battleId_userId: { battleId: inv.battleId, userId } },
        update: { status: ParticipantStatus.JOINED },
        create: { battleId: inv.battleId, userId, status: ParticipantStatus.JOINED },
      });
    }

    return updated;
  }

  async submit(battleId: string, userId: string, dto: SubmitHeadToHeadDto) {
    const battle = await this.prisma.headToHeadBattle.findUnique({ where: { id: battleId } });
    if (!battle) throw new NotFoundException('Battle not found');

    // must be participant (joined)
    const participant = await this.prisma.battleParticipant.findUnique({
      where: { battleId_userId: { battleId, userId } },
    });
    if (!participant || participant.status !== ParticipantStatus.JOINED) {
      throw new ForbiddenException('You must join the battle before submitting');
    }

    // If battle rejects edited photos, you can still store but mark status later by moderator/AI.
    return this.prisma.battleSubmission.upsert({
      where: { battleId_userId: { battleId, userId } },
      update: {
        mediaUrl: dto.mediaUrl,
        thumbnailUrl: dto.thumbnailUrl,
        caption: dto.caption,
        isTrueShotVerified: dto.isTrueShotVerified ?? false,
        isEditedDetected: dto.isEditedDetected ?? false,
        status: dto.status ?? SubmissionStatus.SUBMITTED,
      },
      create: {
        battleId,
        userId,
        mediaUrl: dto.mediaUrl,
        thumbnailUrl: dto.thumbnailUrl,
        caption: dto.caption,
        isTrueShotVerified: dto.isTrueShotVerified ?? false,
        isEditedDetected: dto.isEditedDetected ?? false,
        status: dto.status ?? SubmissionStatus.SUBMITTED,
      },
    });
  }

  async vote(submissionId: string, userId: string, dto: VoteHeadToHeadDto) {
    const submission = await this.prisma.battleSubmission.findUnique({
      where: { id: submissionId },
      include: { battle: true },
    });
    if (!submission) throw new NotFoundException('Submission not found');

    // Optional: prevent voting on your own submission
    if (submission.userId === userId) throw new BadRequestException('Cannot vote on your own submission');

    // Optional: only allow voting when battle is RUNNING
    if (submission.battle.status !== BattleStatus.RUNNING) {
      throw new BadRequestException('Voting is allowed only when battle is RUNNING');
    }

    return this.prisma.battleVote.upsert({
      where: { submissionId_userId: { submissionId, userId } },
      update: { value: dto.value ?? 1, battleId: submission.battleId },
      create: { submissionId, userId, battleId: submission.battleId, value: dto.value ?? 1 },
    });
  }

  async createComment(battleId: string, userId: string, dto: CreateHeadToHeadCommentDto) {
    // validate battle exists
    const battle = await this.prisma.headToHeadBattle.findUnique({ where: { id: battleId } });
    if (!battle) throw new NotFoundException('Battle not found');

    if (dto.submissionId) {
      const sub = await this.prisma.battleSubmission.findUnique({ where: { id: dto.submissionId } });
      if (!sub || sub.battleId !== battleId) throw new BadRequestException('Invalid submissionId for this battle');
    }

    return this.prisma.battleComment.create({
      data: {
        battleId,
        userId,
        submissionId: dto.submissionId ?? null,
        message: dto.message,
      },
    });
  }

  async completeBattle(battleId: string, userId: string) {
    const battle = await this.prisma.headToHeadBattle.findUnique({ where: { id: battleId } });
    if (!battle) throw new NotFoundException('Battle not found');
    if (battle.creatorId !== userId) throw new ForbiddenException('Only creator can complete');

    return this.prisma.$transaction(async (tx) => {
      const submissions = await tx.battleSubmission.findMany({
        where: { battleId, status: SubmissionStatus.SUBMITTED },
        include: { _count: { select: { votes: true } } },
        orderBy: [{ createdAt: 'asc' }],
      });

      if (submissions.length === 0) throw new BadRequestException('No submissions found to pick winner');

      // highest votes wins; tie => earliest createdAt wins (already ordered)
      let winner = submissions[0];
      for (const s of submissions) {
        if ((s._count?.votes ?? 0) > (winner._count?.votes ?? 0)) winner = s;
      }

      const updated = await tx.headToHeadBattle.update({
        where: { id: battleId },
        data: {
          status: BattleStatus.COMPLETED,
          winnerUserId: winner.userId,
        },
      });

      return { battle: updated, winnerUserId: winner.userId, winnerSubmissionId: winner.id };
    });
  }
}