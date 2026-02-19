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

type UpdateProfileBaseDto = Partial<
  Pick<
    CreateProfileDto,
    'profileName' | 'bio' | 'imageUrl' | 'instagramHandler' | 'accountType'
  >
>;

type ChangeProfileTypeDto = Pick<CreateProfileDto, 'profileType'> &
  Partial<
    Pick<
      CreateProfileDto,
      'spotter' | 'owner' | 'creator' | 'business' | 'proDriver' | 'simRacing'
    >
  >;

type ProfileCreateWithRelations = Prisma.ProfileCreateInput & {
  spotter?: Prisma.SpotterProfileCreateNestedOneWithoutProfileInput;
  owner?: Prisma.OwnerProfileCreateNestedOneWithoutProfileInput;
  creator?: Prisma.ContentCreatorProfileCreateNestedOneWithoutProfileInput;
  business?: Prisma.BusinessProfileCreateNestedOneWithoutProfileInput;
  proDriver?: Prisma.ProDriverProfileCreateNestedOneWithoutProfileInput;
  simRacing?: Prisma.SimRacingProfileCreateNestedOneWithoutProfileInput;
};

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) { }
  async createProfile(currentUserId: string, dto: CreateProfileDto) {
    assertPayloadMatchesType(dto);

    const user = await this.prisma.user.findUnique({
      where: { id: currentUserId },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.profile.findUnique({
        where: { userId: currentUserId },
        select: { id: true, userId: true },
      });

      const baseData = {
        profileName: dto.profileName ?? null,
        bio: dto.bio ?? null,
        imageUrl: dto.imageUrl ?? null,
        instagramHandler: dto.instagramHandler ?? null,
        accountType: dto.accountType ?? AccountType.PUBLIC,
        isActive: IsActive.ACTIVE,
        suspend: false,
      };

      if (existing) {
        await tx.profile.update({
          where: { id: existing.id },
          data: baseData,
        });


        await this.ensureSubProfileForType(tx, existing.id, dto);

        return tx.profile.findUnique({
          where: { id: existing.id },
          include: this.profileInclude(),
        });
      }

      const created = await tx.profile.create({
        data: {
          user: { connect: { id: user.id } },
          ...baseData,
          ...(await this.buildCreateNestedForType(dto)),
        } as any,
        include: this.profileInclude(),
      });

      return created;
    });
  }

  async getProfilesByUserId(userId: string) {
    const profiles = await this.prisma.profile.findMany({
      where: { userId },
      include: this.profileInclude(),
    });

    if (!profiles.length) throw new NotFoundException('Profile not found');
    return profiles;
  }

  async getProfileById(profileId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      include: this.profileInclude(),
    });

    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

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
        profileName: dto.profileName ?? undefined,
        bio: dto.bio ?? undefined,
        imageUrl: dto.imageUrl ?? undefined,
        instagramHandler: dto.instagramHandler ?? undefined,
        accountType: dto.accountType as any,
      },
      include: this.profileInclude(),
    });
  }

  async changeProfileType(profileId: string, currentUserId: string, dto: ChangeProfileTypeDto) {
    assertPayloadMatchesType(dto);

    return this.prisma.$transaction(async (tx) => {
      const profile = await tx.profile.findUnique({
        where: { id: profileId },
        include: { simRacing: true },
      });
      if (!profile) throw new NotFoundException('Profile not found');
      if (profile.userId !== currentUserId) throw new ForbiddenException('No access');

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
              creatorCategory: (dto.creator?.creatorCategory as any) ?? undefined,
              youtubeChanel: dto.creator?.youtubeChanel ?? undefined,
              portfolioWebsite: dto.creator?.portfolioWebsite ?? undefined,
            },
            create: {
              profileId,
              creatorCategory:
                (dto.creator?.creatorCategory as any) ?? ContentCategory.PHOTOGRAPHY,
              youtubeChanel: dto.creator?.youtubeChanel ?? null,
              portfolioWebsite: dto.creator?.portfolioWebsite ?? null,
            },
          });
          break;

        case ProfileType.PRO_BUSSINESS: {
          if (!dto.business?.businessName || !dto.business?.location) {
            throw new BadRequestException('businessName and location are required for BUSINESS profile');
          }
          await tx.businessProfile.upsert({
            where: { profileId },
            update: {
              businessCategory: (dto.business.businessCategory as any) ?? undefined,
              businessName: dto.business.businessName,
              location: dto.business.location,
            },
            create: {
              profileId,
              businessCategory:
                (dto.business.businessCategory as any) ?? BusinessCategory.Detailling_Care,
              businessName: dto.business.businessName,
              location: dto.business.location,

            },
          });
          break;
        }

        case ProfileType.PRO_DRIVER: {
          if (!dto.proDriver?.location) {
            throw new BadRequestException('location is required for PRO_DRIVER profile');
          }
          await tx.proDriverProfile.upsert({
            where: { profileId },
            update: {
              racingDiscipline: (dto.proDriver.racingDiscipline as any) ?? undefined,
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
          username: true,
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


  private async buildCreateNestedForType(dto: CreateProfileDto) {
    switch (dto.profileType) {
      case ProfileType.SPOTTER:
        return { spotter: { create: dto.spotter ?? {} } };

      case ProfileType.OWNER:
        return { owner: { create: dto.owner ?? {} } };

      case ProfileType.CONTENT_CREATOR:
        return {
          creator: {
            create: {
              creatorCategory: dto.creator?.creatorCategory ?? ContentCategory.PHOTOGRAPHY,
              youtubeChanel: dto.creator?.youtubeChanel ?? null,
              portfolioWebsite: dto.creator?.portfolioWebsite ?? null,
            },
          },
        };

      case ProfileType.PRO_BUSSINESS: {
        if (!dto.business?.businessName || !dto.business?.location) {
          throw new BadRequestException('businessName and location are required for BUSINESS profile');
        }
        return {
          business: {
            create: {
              businessCategory: dto.business.businessCategory ?? BusinessCategory.Detailling_Care,
              businessName: dto.business.businessName,
              location: dto.business.location,
            },
          },
        };
      }

      case ProfileType.PRO_DRIVER: {
        if (!dto.proDriver?.location) {
          throw new BadRequestException('location is required for PRO_DRIVER profile');
        }
        return {
          proDriver: {
            create: {
              racingDiscipline: (dto.proDriver.racingDiscipline as any) ?? RacingType.GT_Racing,
              location: dto.proDriver.location,
            },
          },
        };
      }

      case ProfileType.SIM_RACING_DRIVER: {
        const sim = dto.simRacing ?? {};
        return {
          simRacing: {
            create: {
              hardwareSetup: sim.hardwareSetup ? { create: { ...sim.hardwareSetup } } : undefined,
              displayAndPcSetup: sim.displayAndPcSetup ? { create: { ...sim.displayAndPcSetup } } : undefined,
              drivingAssistant: sim.drivingAssistant ? { create: { ...sim.drivingAssistant } } : undefined,
              racing: sim.racing ? { create: { ...sim.racing } } : undefined,
              setupDescription: sim.setupDescription ? { create: { ...sim.setupDescription } } : undefined,
            },
          },
        };
      }

      default:
        throw new BadRequestException('Invalid profile type');
    }
  }

  private async ensureSubProfileForType(tx: any, profileId: string, dto: CreateProfileDto) {
    switch (dto.profileType) {
      case ProfileType.SPOTTER:
        await tx.spotterProfile.upsert({
          where: { profileId },
          update: { ...(dto.spotter ?? {}) },
          create: { profileId, ...(dto.spotter ?? {}) },
        });
        break;

      case ProfileType.OWNER:
        await tx.ownerProfile.upsert({
          where: { profileId },
          update: { ...(dto.owner ?? {}) },
          create: { profileId, ...(dto.owner ?? {}) },
        });
        break;

      case ProfileType.CONTENT_CREATOR:
        await tx.contentCreatorProfile.upsert({
          where: { profileId },
          update: {
            creatorCategory: (dto.creator?.creatorCategory as any) ?? undefined,
            youtubeChanel: dto.creator?.youtubeChanel ?? undefined,
            portfolioWebsite: dto.creator?.portfolioWebsite ?? undefined,
          },
          create: {
            profileId,
            creatorCategory: (dto.creator?.creatorCategory as any) ?? ContentCategory.PHOTOGRAPHY,
            youtubeChanel: dto.creator?.youtubeChanel ?? null,
            portfolioWebsite: dto.creator?.portfolioWebsite ?? null,
          },
        });
        break;

      case ProfileType.PRO_BUSSINESS: {
        if (!dto.business?.businessName || !dto.business?.location) {
          throw new BadRequestException('businessName and location are required for BUSINESS profile');
        }
        await tx.businessProfile.upsert({
          where: { profileId },
          update: {
            businessCategory: (dto.business.businessCategory as any) ?? undefined,
            businessName: dto.business.businessName,
            location: dto.business.location,
          },
          create: {
            profileId,
            businessCategory: (dto.business.businessCategory as any) ?? BusinessCategory.Detailling_Care,
            businessName: dto.business.businessName,
            location: dto.business.location,
          },
        });
        break;
      }

      case ProfileType.PRO_DRIVER: {
        if (!dto.proDriver?.location) {
          throw new BadRequestException('location is required for PRO_DRIVER profile');
        }
        await tx.proDriverProfile.upsert({
          where: { profileId },
          update: {
            racingDiscipline: (dto.proDriver.racingDiscipline as any) ?? undefined,
            location: dto.proDriver.location,
          },
          create: {
            profileId,
            racingDiscipline: (dto.proDriver.racingDiscipline as any) ?? RacingType.GT_Racing,
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
  }

  async deleteProfileType(
    profileId: string,
    currentUserId: string,
    profileType: ProfileType,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const profile = await tx.profile.findUnique({
        where: { id: profileId },
        include: { simRacing: true },
      });

      if (!profile) throw new NotFoundException('Profile not found');
      if (profile.userId !== currentUserId)
        throw new ForbiddenException('No access');

      switch (profileType) {
        case ProfileType.SPOTTER:
          await tx.spotterProfile.deleteMany({
            where: { profileId },
          });
          break;

        case ProfileType.OWNER:
          await tx.ownerProfile.deleteMany({
            where: { profileId },
          });
          break;

        case ProfileType.CONTENT_CREATOR:
          await tx.contentCreatorProfile.deleteMany({
            where: { profileId },
          });
          break;

        case ProfileType.PRO_BUSSINESS:
          await tx.businessProfile.deleteMany({
            where: { profileId },
          });
          break;

        case ProfileType.PRO_DRIVER:
          await tx.proDriverProfile.deleteMany({
            where: { profileId },
          });
          break;

        case ProfileType.SIM_RACING_DRIVER:
          if (profile.simRacing) {
            await tx.simRacingProfile.delete({
              where: { profileId },
            });
          }
          break;

        default:
          throw new BadRequestException('Invalid profile type');
      }

      return tx.profile.findUnique({
        where: { id: profileId },
        include: this.profileInclude(),
      });
    });
  }
  
}
