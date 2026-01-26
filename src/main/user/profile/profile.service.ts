import { PrismaService } from '@/common/prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  AccountType,
  BusinessCategory,
  ContentCategory,
  IsActive,
  RacingType,
  Type as ProfileType, // Prisma enum name: Type
} from 'generated/prisma/enums';
import { CreateProfileDto } from './dto/create.profile.dto';
import { Prisma } from 'generated/prisma/client';
import { assertPayloadMatchesType } from './utils/profile-type.validator';

// চাইলে Update DTO গুলো আলাদা রাখুন, এখানে inline minimal type দিলাম:
type UpdateProfileBaseDto = Partial<
  Pick<
    CreateProfileDto,
    'userName' | 'bio' | 'imageUrl' | 'instagramHandler' | 'accountType'
  >
>;

type ChangeProfileTypeDto = Pick<CreateProfileDto, 'profileType'> &
  Partial<
    Pick<
      CreateProfileDto,
      'spotter' | 'owner' | 'creator' | 'business' | 'proDriver' | 'simRacing'
    >
  >;

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  // ---------- CREATE ----------
  async createProfile(currentUserId: string, dto: CreateProfileDto) {
    assertPayloadMatchesType(dto);
    const user = await this.prisma.user.findUnique({
      where: { id: currentUserId },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.$transaction(async (tx) => {
      const profileData: Prisma.ProfileCreateInput = {
        user: { connect: { id: user.id } },
        userName: dto.userName ?? null,
        bio: dto.bio ?? null,
        imageUrl: dto.imageUrl ?? null,
        instagramHandler: dto.instagramHandler ?? null,
        accountType: (dto.accountType as any) ?? AccountType.PUBLIC,
        profileType: dto.profileType as any,
        isActive: IsActive.ACTIVE as any,
        suspend: false,
      };

      switch (dto.profileType) {
        case ProfileType.SPOTTER:
          (profileData as any).spotter = { create: dto.spotter ?? {} };
          break;

        case ProfileType.OWNER:
          (profileData as any).owner = { create: dto.owner ?? {} };
          break;

        case ProfileType.CONTENT_CREATOR:
          (profileData as any).creator = {
            create: {
              creatorCategory:
                (dto.creator?.creatorCategory as any) ??
                ContentCategory.PHOTOGRAPHY,
              youtubeChanel: dto.creator?.youtubeChanel ?? null,
              portfolioWebsite: dto.creator?.portfolioWebsite ?? null,
            },
          };
          break;

        case ProfileType.PRO_BUSSINESS: {
          if (!dto.business?.businessName || !dto.business?.location) {
            throw new BadRequestException(
              'businessName and location are required for BUSINESS profile',
            );
          }
          (profileData as any).business = {
            create: {
              businessCategory:
                (dto.business.businessCategory as any) ??
                BusinessCategory.Detailling_Care,
              businessName: dto.business.businessName,
              location: dto.business.location,
            },
          };
          break;
        }

        case ProfileType.PRO_DRIVER: {
          if (!dto.proDriver?.location) {
            throw new BadRequestException(
              'location is required for PRO_DRIVER profile',
            );
          }
          (profileData as any).proDriver = {
            create: {
              racingDiscipline:
                (dto.proDriver.racingDiscipline as any) ?? RacingType.GT_Racing,
              location: dto.proDriver.location,
            },
          };
          break;
        }

        case ProfileType.SIM_RACING_DRIVER: {
          const sim = dto.simRacing ?? {};
          (profileData as any).simRacing = {
            create: {
              hardwareSetup: sim.hardwareSetup
                ? { create: { ...sim.hardwareSetup } }
                : undefined,
              displayAndPcSetup: sim.displayAndPcSetup
                ? { create: { ...sim.displayAndPcSetup } }
                : undefined,
              drivingAssistant: sim.drivingAssistant
                ? { create: { ...sim.drivingAssistant } }
                : undefined,
              racing: sim.racing ? { create: { ...sim.racing } } : undefined,
              setupDescription: sim.setupDescription
                ? { create: { ...sim.setupDescription } }
                : undefined,
            },
          };
          break;
        }

        default:
          throw new BadRequestException('Invalid profile type');
      }

      const created = await tx.profile.create({
        data: profileData,
        include: this.profileInclude(),
      });

      return created;
    });
  }

  // ---------- READ: list user profiles ----------
  async getProfilesByUserId(userId: string) {
    const profiles = await this.prisma.profile.findMany({
      where: { userId },
      include: this.profileInclude(),
    });

    if (!profiles.length) throw new NotFoundException('Profile not found');
    return profiles;
  }

  // ---------- READ: single by profileId ----------
  async getProfileById(profileId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      include: this.profileInclude(),
    });

    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  // ---------- UPDATE: base fields only (no profileType switch) ----------
  async updateProfileBase(
    profileId: string,
    currentUserId: string,
    dto: UpdateProfileBaseDto,
  ) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      select: { id: true, userId: true },
    });
    if (!profile) throw new NotFoundException('Profile not found');
    if (profile.userId !== currentUserId)
      throw new ForbiddenException('No access');

    return this.prisma.profile.update({
      where: { id: profileId },
      data: {
        userName: dto.userName ?? undefined,
        bio: dto.bio ?? undefined,
        imageUrl: dto.imageUrl ?? undefined,
        instagramHandler: dto.instagramHandler ?? undefined,
        accountType: dto.accountType as any,
      },
      include: this.profileInclude(),
    });
  }

  // ---------- CHANGE TYPE: profileType change + create new subprofile + upsert sim nested ----------
  async changeProfileType(
    profileId: string,
    currentUserId: string,
    dto: ChangeProfileTypeDto,
  ) {
    assertPayloadMatchesType(dto);

    return this.prisma.$transaction(async (tx) => {
      const profile = await tx.profile.findUnique({
        where: { id: profileId },
        include: { simRacing: true },
      });
      if (!profile) throw new NotFoundException('Profile not found');
      if (profile.userId !== currentUserId)
        throw new ForbiddenException('No access');

      await tx.profile.update({
        where: { id: profileId },
        data: { profileType: dto.profileType as any },
      });

      switch (dto.profileType) {
        case ProfileType.SPOTTER:
          await tx.spotterProfile.upsert({
            where: { profileId },
            update: {},
            create: { profileId },
          });
          break;

        case ProfileType.OWNER:
          await tx.ownerProfile.upsert({
            where: { profileId },
            update: {},
            create: { profileId },
          });
          break;

        case ProfileType.CONTENT_CREATOR:
          await tx.contentCreatorProfile.upsert({
            where: { profileId },
            update: {
              creatorCategory:
                (dto.creator?.creatorCategory as any) ?? undefined,
              youtubeChanel: dto.creator?.youtubeChanel ?? undefined,
              portfolioWebsite: dto.creator?.portfolioWebsite ?? undefined,
            },
            create: {
              profileId,
              creatorCategory:
                (dto.creator?.creatorCategory as any) ??
                ContentCategory.PHOTOGRAPHY,
              youtubeChanel: dto.creator?.youtubeChanel ?? null,
              portfolioWebsite: dto.creator?.portfolioWebsite ?? null,
            },
          });
          break;

        case ProfileType.PRO_BUSSINESS: {
          if (!dto.business?.businessName || !dto.business?.location) {
            throw new BadRequestException(
              'businessName and location are required for BUSINESS profile',
            );
          }
          await tx.businessProfile.upsert({
            where: { profileId },
            update: {
              businessCategory:
                (dto.business.businessCategory as any) ?? undefined,
              businessName: dto.business.businessName,
              location: dto.business.location,
            },
            create: {
              profileId,
              businessCategory:
                (dto.business.businessCategory as any) ??
                BusinessCategory.Detailling_Care,
              businessName: dto.business.businessName,
              location: dto.business.location,
            },
          });
          break;
        }

        case ProfileType.PRO_DRIVER: {
          if (!dto.proDriver?.location) {
            throw new BadRequestException(
              'location is required for PRO_DRIVER profile',
            );
          }
          await tx.proDriverProfile.upsert({
            where: { profileId },
            update: {
              racingDiscipline:
                (dto.proDriver.racingDiscipline as any) ?? undefined,
              location: dto.proDriver.location,
            },
            create: {
              profileId,
              racingDiscipline:
                (dto.proDriver.racingDiscipline as any) ?? RacingType.GT_Racing,
              location: dto.proDriver.location,
            },
          });
          break;
        }

        case ProfileType.SIM_RACING_DRIVER: {
          const sim = await tx.simRacingProfile.upsert({
            where: { profileId },
            update: {},
            create: { profileId },
          });

          const payload = dto.simRacing;
          if (payload?.hardwareSetup) {
            await tx.hardwareSetup.upsert({
              where: { simRacingId: sim.id },
              update: { ...payload.hardwareSetup },
              create: { simRacingId: sim.id, ...payload.hardwareSetup },
            });
          }

          if (payload?.displayAndPcSetup) {
            await tx.displayAndPcSetup.upsert({
              where: { simRacingId: sim.id },
              update: { ...payload.displayAndPcSetup },
              create: { simRacingId: sim.id, ...payload.displayAndPcSetup },
            });
          }

          if (payload?.drivingAssistant) {
            await tx.drivingAssistant.upsert({
              where: { simRacingId: sim.id },
              update: { ...payload.drivingAssistant },
              create: { simRacingId: sim.id, ...payload.drivingAssistant },
            });
          }

          if (payload?.racing) {
            await tx.racing.upsert({
              where: { simRacingId: sim.id },
              update: { ...payload.racing },
              create: { simRacingId: sim.id, ...payload.racing },
            });
          }

          if (payload?.setupDescription) {
            await tx.setupDescriptionPhoto.upsert({
              where: { simRacingId: sim.id },
              update: { ...payload.setupDescription },
              create: { simRacingId: sim.id, ...payload.setupDescription },
            });
          }

          break;
        }

        default:
          throw new BadRequestException('Invalid profile type');
      }
      return tx.profile.findUnique({
        where: { id: profileId },
        include: this.profileInclude(),
      });
    });
  }

  private profileInclude(): Prisma.ProfileInclude {
    return {
      user: {
        select: {
          id: true,
          email: true,
          username:true,
          phone: true,
        },
      },
      spotter: true,
      owner: true,
      creator: true,
      business: true,
      proDriver: true,
      simRacing: {
        include: {
          hardwareSetup: true,
          displayAndPcSetup: true,
          drivingAssistant: true,
          racing: true,
          setupDescription: true,
        },
      },
    };
  }
}
