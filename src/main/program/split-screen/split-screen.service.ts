import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateSplitScreenMatchDto } from './dto/create-split-screen-match.dto';
import { SplitScreenBattleQueryDto } from './dto/split-screen-battle-query.dto';
import { LeagueRankingQueryDto } from './dto/league-ranking-query.dto';
import { SplitScreenBattleCategory, SplitScreenBattleStatus, SplitScreenDivision, SplitScreenLeagueCode, SplitScreenMatchStatus, SplitScreenParticipantResult, SplitScreenPreferenceMode, SplitScreenVoteType } from 'generated/prisma/enums';
import { VoteSplitScreenBattleDto } from './dto/vote-split-screen.dto';

@Injectable()
export class SplitScreenService {
  constructor(private readonly prisma: PrismaService) {}

  private battleInclude() {
    return {
      leftProfile: {
        select: {
          id: true,
          profileName: true,
          imageUrl: true,
        },
      },
      rightProfile: {
        select: {
          id: true,
          profileName: true,
          imageUrl: true,
        },
      },
      leftCar: {
        select: {
          id: true,
          image: true,
          make: true,
          model: true,
          displayName: true,
          color: true,
        },
      },
      rightCar: {
        select: {
          id: true,
          image: true,
          make: true,
          model: true,
          displayName: true,
          color: true,
        },
      },
      participants: {
        select: {
          id: true,
          userId: true,
          profileId: true,
          carId: true,
          side: true,
          votes: true,
          result: true,
        },
      },
    };
  }

  private async validateProfileOwnership(userId: string, profileId: string) {
    const profile = await this.prisma.profile.findFirst({
      where: {
        id: profileId,
        userId,
      },
    });

    if (!profile) {
      throw new ForbiddenException('You do not have access to this profile');
    }

    return profile;
  }

  private async validateCarOwnership(profileId: string, carId: string) {
    const car = await this.prisma.car.findFirst({
      where: {
        id: carId,
        profileId,
      },
    });

    if (!car) {
      throw new BadRequestException(
        'Selected car does not belong to this profile',
      );
    }

    return car;
  }

  private isCompatiblePreference(
    requester: {
      preferenceMode: SplitScreenPreferenceMode;
      preferredBrand?: string | null;
      carMake?: string | null;
      carModel?: string | null;
      prestigePoint?: number | null;
    },
    opponent: {
      carMake?: string | null;
      carModel?: string | null;
      prestigePoint?: number | null;
    },
  ) {
    switch (requester.preferenceMode) {
      case SplitScreenPreferenceMode.ANY_CAR_BRAND:
        return true;

      case SplitScreenPreferenceMode.SAME_BRAND_ONLY:
        return (
          !!requester.carMake &&
          !!opponent.carMake &&
          requester.carMake.toLowerCase() === opponent.carMake.toLowerCase()
        );

      case SplitScreenPreferenceMode.SAME_MODEL_ONLY:
        return (
          !!requester.carMake &&
          !!requester.carModel &&
          !!opponent.carMake &&
          !!opponent.carModel &&
          requester.carMake.toLowerCase() === opponent.carMake.toLowerCase() &&
          requester.carModel.toLowerCase() === opponent.carModel.toLowerCase()
        );

      case SplitScreenPreferenceMode.SPECIFIC_BRAND:
        return (
          !!requester.preferredBrand &&
          !!opponent.carMake &&
          requester.preferredBrand.toLowerCase() === opponent.carMake.toLowerCase()
        );

      case SplitScreenPreferenceMode.SIMILAR_PRESTIGE:
        if (
          requester.prestigePoint == null ||
          opponent.prestigePoint == null
        ) {
          return true;
        }

        return Math.abs(requester.prestigePoint - opponent.prestigePoint) <= 30;

      default:
        return true;
    }
  }

  private async findCompatibleRequest(params: {
    userId: string;
    profileId: string;
    carId: string;
    league: SplitScreenLeagueCode;
    division: SplitScreenDivision;
    battleCategory: SplitScreenBattleCategory;
    preferenceMode: SplitScreenPreferenceMode;
    preferredBrand?: string;
    carMake?: string | null;
    carModel?: string | null;
    prestigePoint?: number | null;
  }) {
    const candidates = await this.prisma.splitScreenMatchRequest.findMany({
      where: {
        status: SplitScreenMatchStatus.SEARCHING,
        league: params.league,
        division: params.division,
        battleCategory: params.battleCategory,
        userId: { not: params.userId },
        profileId: { not: params.profileId },
        carId: { not: params.carId },
      },
      include: {
        car: {
          select: {
            id: true,
            make: true,
            model: true,
            displayName: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 20,
    });

    for (const candidate of candidates) {
      const firstCheck = this.isCompatiblePreference(
        {
          preferenceMode: params.preferenceMode,
          preferredBrand: params.preferredBrand,
          carMake: params.carMake,
          carModel: params.carModel,
          prestigePoint: params.prestigePoint,
        },
        {
          carMake: candidate.car?.make,
          carModel: candidate.car?.model,
          prestigePoint: candidate.prestigePoint,
        },
      );

      const secondCheck = this.isCompatiblePreference(
        {
          preferenceMode: candidate.preferenceMode,
          preferredBrand: candidate.preferredBrand,
          carMake: candidate.car?.make,
          carModel: candidate.car?.model,
          prestigePoint: candidate.prestigePoint,
        },
        {
          carMake: params.carMake,
          carModel: params.carModel,
          prestigePoint: params.prestigePoint,
        },
      );

      if (firstCheck && secondCheck) {
        return candidate;
      }
    }

    return null;
  }

  async getMyProfileCars(userId: string, profileId: string) {
    await this.validateProfileOwnership(userId, profileId);

    return this.prisma.car.findMany({
      where: { profileId },
      select: {
        id: true,
        image: true,
        make: true,
        model: true,
        displayName: true,
        color: true,
      },
      orderBy: {
        displayName: 'asc',
      },
    });
  }

  async mySearchingRequest(userId: string) {
    return this.prisma.splitScreenMatchRequest.findFirst({
      where: {
        userId,
        status: SplitScreenMatchStatus.SEARCHING,
      },
      include: {
        car: {
          select: {
            id: true,
            image: true,
            make: true,
            model: true,
            displayName: true,
          },
        },
        profile: {
          select: {
            id: true,
            profileName: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findMatch(userId: string, dto: CreateSplitScreenMatchDto) {
    await this.validateProfileOwnership(userId, dto.profileId);
    const car = await this.validateCarOwnership(dto.profileId, dto.carId);

    if (
      dto.preferenceMode === SplitScreenPreferenceMode.SPECIFIC_BRAND &&
      !dto.preferredBrand
    ) {
      throw new BadRequestException(
        'preferredBrand is required when preferenceMode is SPECIFIC_BRAND',
      );
    }

    const existingSearchingRequest =
      await this.prisma.splitScreenMatchRequest.findFirst({
        where: {
          userId,
          status: SplitScreenMatchStatus.SEARCHING,
        },
      });

    if (existingSearchingRequest) {
      throw new BadRequestException(
        'You already have an active matchmaking request',
      );
    }

    const prestigePoint = 300;

    const createdRequest = await this.prisma.splitScreenMatchRequest.create({
      data: {
        userId,
        profileId: dto.profileId,
        carId: dto.carId,
        league: dto.league,
        division: dto.division,
        matchmakingMode: dto.matchmakingMode,
        preferenceMode: dto.preferenceMode,
        preferredBrand: dto.preferredBrand,
        battleCategory: dto.battleCategory,
        prestigePoint,
        status: SplitScreenMatchStatus.SEARCHING,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      include: {
        car: {
          select: {
            id: true,
            image: true,
            make: true,
            model: true,
            displayName: true,
          },
        },
      },
    });

    const compatibleRequest = await this.findCompatibleRequest({
      userId,
      profileId: dto.profileId,
      carId: dto.carId,
      league: dto.league,
      division: dto.division,
      battleCategory: dto.battleCategory,
      preferenceMode: dto.preferenceMode,
      preferredBrand: dto.preferredBrand,
      carMake: car.make,
      carModel: car.model,
      prestigePoint,
    });

    if (!compatibleRequest) {
      return {
        matched: false,
        message: 'Searching for opponent',
        request: createdRequest,
      };
    }

    const battle = await this.prisma.$transaction(async (tx) => {
      const createdBattle = await tx.splitScreenBattle.create({
        data: {
          league: dto.league,
          division: dto.division,
          category: dto.battleCategory,
          matchmakingMode: dto.matchmakingMode,
          preferenceMode: dto.preferenceMode,
          preferredBrand: dto.preferredBrand,

          leftUserId: compatibleRequest.userId,
          leftProfileId: compatibleRequest.profileId,
          leftCarId: compatibleRequest.carId,

          rightUserId: userId,
          rightProfileId: dto.profileId,
          rightCarId: dto.carId,

          leftRequestId: compatibleRequest.id,
          rightRequestId: createdRequest.id,

          status: SplitScreenBattleStatus.LIVE,
          startedAt: new Date(),

          participants: {
            create: [
              {
                userId: compatibleRequest.userId,
                profileId: compatibleRequest.profileId,
                carId: compatibleRequest.carId,
                side: SplitScreenVoteType.LEFT,
              },
              {
                userId,
                profileId: dto.profileId,
                carId: dto.carId,
                side: SplitScreenVoteType.RIGHT,
              },
            ],
          },
        },
        include: this.battleInclude(),
      });

      await tx.splitScreenMatchRequest.update({
        where: { id: compatibleRequest.id },
        data: {
          status: SplitScreenMatchStatus.MATCHED,
          matchedBattleId: createdBattle.id,
          matchedAt: new Date(),
        },
      });

      await tx.splitScreenMatchRequest.update({
        where: { id: createdRequest.id },
        data: {
          status: SplitScreenMatchStatus.MATCHED,
          matchedBattleId: createdBattle.id,
          matchedAt: new Date(),
        },
      });

      return createdBattle;
    });

    return {
      matched: true,
      message: 'Opponent found successfully',
      battle,
    };
  }

  async cancelSearch(userId: string, requestId: string) {
    const request = await this.prisma.splitScreenMatchRequest.findFirst({
      where: {
        id: requestId,
        userId,
        status: SplitScreenMatchStatus.SEARCHING,
      },
    });

    if (!request) {
      throw new NotFoundException('Active searching request not found');
    }

    return this.prisma.splitScreenMatchRequest.update({
      where: { id: request.id },
      data: {
        status: SplitScreenMatchStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });
  }

  async getBattles(query: SplitScreenBattleQueryDto) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) where.status = query.status;
    if (query.league) where.league = query.league;
    if (query.division) where.division = query.division;
    if (query.category) where.category = query.category;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.splitScreenBattle.findMany({
        where,
        include: this.battleInclude(),
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.splitScreenBattle.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async myBattles(userId: string, query: SplitScreenBattleQueryDto) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const skip = (page - 1) * limit;

    const where: any = {
      OR: [{ leftUserId: userId }, { rightUserId: userId }],
    };

    if (query.status) where.status = query.status;
    if (query.league) where.league = query.league;
    if (query.division) where.division = query.division;
    if (query.category) where.category = query.category;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.splitScreenBattle.findMany({
        where,
        include: this.battleInclude(),
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.splitScreenBattle.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async getBattleById(battleId: string) {
    const battle = await this.prisma.splitScreenBattle.findUnique({
      where: { id: battleId },
      include: {
        ...this.battleInclude(),
        votes: {
          select: {
            id: true,
            voterId: true,
            vote: true,
            createdAt: true,
          },
        },
      },
    });

    if (!battle) {
      throw new NotFoundException('Battle not found');
    }

    return battle;
  }

  async voteBattle(
    userId: string,
    battleId: string,
    dto: VoteSplitScreenBattleDto,
  ) {
    const battle = await this.prisma.splitScreenBattle.findUnique({
      where: { id: battleId },
    });

    if (!battle) {
      throw new NotFoundException('Battle not found');
    }

    if (battle.status !== SplitScreenBattleStatus.LIVE) {
      throw new BadRequestException('Voting is allowed only on live battles');
    }

    if (battle.leftUserId === userId || battle.rightUserId === userId) {
      throw new ForbiddenException('Battle participants cannot vote');
    }

    const existingVote = await this.prisma.splitScreenBattleVote.findUnique({
      where: {
        battleId_voterId: {
          battleId,
          voterId: userId,
        },
      },
    });

    if (existingVote) {
      throw new BadRequestException('You already voted in this battle');
    }

    const isLeft = dto.vote === SplitScreenVoteType.LEFT;

    await this.prisma.$transaction([
      this.prisma.splitScreenBattleVote.create({
        data: {
          battleId,
          voterId: userId,
          vote: dto.vote,
        },
      }),
      this.prisma.splitScreenBattle.update({
        where: { id: battleId },
        data: {
          totalVotes: { increment: 1 },
          leftVotes: isLeft ? { increment: 1 } : undefined,
          rightVotes: !isLeft ? { increment: 1 } : undefined,
        },
      }),
      this.prisma.splitScreenBattleParticipant.updateMany({
        where: {
          battleId,
          side: dto.vote,
        },
        data: {
          votes: { increment: 1 },
        },
      }),
    ]);

    return this.getBattleById(battleId);
  }

  async completeBattle(battleId: string) {
    const battle = await this.prisma.splitScreenBattle.findUnique({
      where: { id: battleId },
    });

    if (!battle) {
      throw new NotFoundException('Battle not found');
    }

    if (battle.status !== SplitScreenBattleStatus.LIVE) {
      throw new BadRequestException('Only live battle can be completed');
    }

    let winnerSide: SplitScreenVoteType | null = null;

    if (battle.leftVotes > battle.rightVotes) {
      winnerSide = SplitScreenVoteType.LEFT;
    } else if (battle.rightVotes > battle.leftVotes) {
      winnerSide = SplitScreenVoteType.RIGHT;
    }

    const leftResult =
      winnerSide === SplitScreenVoteType.LEFT
        ? SplitScreenParticipantResult.WIN
        : winnerSide === SplitScreenVoteType.RIGHT
        ? SplitScreenParticipantResult.LOSS
        : SplitScreenParticipantResult.DRAW;

    const rightResult =
      winnerSide === SplitScreenVoteType.RIGHT
        ? SplitScreenParticipantResult.WIN
        : winnerSide === SplitScreenVoteType.LEFT
        ? SplitScreenParticipantResult.LOSS
        : SplitScreenParticipantResult.DRAW;

    await this.prisma.$transaction([
      this.prisma.splitScreenBattle.update({
        where: { id: battleId },
        data: {
          status: SplitScreenBattleStatus.COMPLETED,
          winnerSide,
          completedAt: new Date(),
        },
      }),
      this.prisma.splitScreenBattleParticipant.updateMany({
        where: {
          battleId,
          side: SplitScreenVoteType.LEFT,
        },
        data: {
          result: leftResult,
        },
      }),
      this.prisma.splitScreenBattleParticipant.updateMany({
        where: {
          battleId,
          side: SplitScreenVoteType.RIGHT,
        },
        data: {
          result: rightResult,
        },
      }),
    ]);

    return this.getBattleById(battleId);
  }

  async getLeagueRankings(query: LeagueRankingQueryDto) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);
    const skip = (page - 1) * limit;

    const where: any = {
      status: SplitScreenBattleStatus.COMPLETED,
    };

    if (query.league) where.league = query.league;
    if (query.division) where.division = query.division;

    const battles = await this.prisma.splitScreenBattle.findMany({
      where,
      include: {
        leftProfile: {
          select: {
            id: true,
            profileName: true,
            imageUrl: true,
          },
        },
        rightProfile: {
          select: {
            id: true,
            profileName: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    const rankingMap = new Map<string, any>();

    for (const battle of battles) {
      if (!rankingMap.has(battle.leftProfileId)) {
        rankingMap.set(battle.leftProfileId, {
          profileId: battle.leftProfileId,
          profileName: battle.leftProfile?.profileName,
          imageUrl: battle.leftProfile?.imageUrl,
          wins: 0,
          losses: 0,
          draws: 0,
          totalBattles: 0,
          points: 0,
        });
      }

      if (!rankingMap.has(battle.rightProfileId)) {
        rankingMap.set(battle.rightProfileId, {
          profileId: battle.rightProfileId,
          profileName: battle.rightProfile?.profileName,
          imageUrl: battle.rightProfile?.imageUrl,
          wins: 0,
          losses: 0,
          draws: 0,
          totalBattles: 0,
          points: 0,
        });
      }

      const left = rankingMap.get(battle.leftProfileId);
      const right = rankingMap.get(battle.rightProfileId);

      left.totalBattles += 1;
      right.totalBattles += 1;

      if (battle.winnerSide === SplitScreenVoteType.LEFT) {
        left.wins += 1;
        left.points += 3;
        right.losses += 1;
      } else if (battle.winnerSide === SplitScreenVoteType.RIGHT) {
        right.wins += 1;
        right.points += 3;
        left.losses += 1;
      } else {
        left.draws += 1;
        right.draws += 1;
        left.points += 1;
        right.points += 1;
      }
    }

    const ranked = Array.from(rankingMap.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.wins - a.wins;
    });

    return {
      data: ranked.slice(skip, skip + limit).map((item, index) => ({
        rank: skip + index + 1,
        ...item,
      })),
      meta: {
        page,
        limit,
        total: ranked.length,
        totalPage: Math.ceil(ranked.length / limit),
      },
    };
  }
}