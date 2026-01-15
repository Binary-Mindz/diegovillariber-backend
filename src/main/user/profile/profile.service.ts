import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { AccountType, CreateProfileDto, ProfileType } from './dto/create.profile.dto';


@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async createProfile(createProfileDto: CreateProfileDto) {
    const { userId, userName, bio, imageUrl, instagramHandler, accountType, profileType } = createProfileDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });
if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if profile already exists
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId }
    });

    if (existingProfile) {
      throw new ConflictException('Profile already exists for this user');
    }
      // Build profile data
    const profileData: any = {
      userId,
      userName,
      bio,
      imageUrl,
      instagramHandler,
      accountType: accountType || AccountType.PUBLIC,
      profileType,
      isActive: 'ACTIVE',
      suspend: false
    };
    switch (profileType) {
      case ProfileType.SPOTTER:
        profileData.spotter = { create: {} };
        break;
      case ProfileType.OWNER:
        profileData.owner = { create: {} };
        break;
      case ProfileType.CONTENT_CREATOR:
        profileData.creator = { create: {} };
        break;
      case ProfileType.BUSINESS:
        profileData.business = { create: {} };
        break;
      case ProfileType.PRO_DRIVER:
        profileData.proDriver = { create: {} };
        break;
      case ProfileType.SIM_RACING:
        profileData.simRacing = { create: {} };
        break;
      default:
        throw new BadRequestException('Invalid profile type');
    }
    const profile = await this.prisma.profile.create({
      data: profileData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        spotter: true,
        owner: true,
        creator: true,
        business: true,
        proDriver: true,
        simRacing: true
      }
    });

    return profile;
  }
   async getProfileByUserId(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        spotter: true,
        owner: true,
        creator: true,
        business: true,
        proDriver: true,
        simRacing: true
      }
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }
}