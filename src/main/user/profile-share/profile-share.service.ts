import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as QRCode from 'qrcode';
import { customAlphabet } from 'nanoid';
import { ProfileShareResponseDto } from './dto/profile-share-response.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 6);

@Injectable()
export class ProfileShareService {
  constructor(private readonly prisma: PrismaService) {}

  private buildSlug(profileName?: string | null) {
    const base =
      profileName
        ?.trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'profile';

    return `${base}-${nanoid()}`;
  }

  private buildShareUrl(slug: string) {
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:5000';
    const path = process.env.PROFILE_SHARE_PATH || '/profile';
    return `${baseUrl}${path}/${slug}`;
  }

  async getOrCreateShareData(
    authUserId: string,
    profileId: string,
  ): Promise<ProfileShareResponseDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      select: {
        id: true,
        userId: true,
        profileName: true,
        imageUrl: true,
        accountType: true,
        suspend: true,
        isActive: true,
        shareSlug: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.userId !== authUserId) {
      throw new ForbiddenException('You cannot share this profile');
    }

    if (profile.accountType !== 'PUBLIC') {
      throw new ForbiddenException('Private profiles cannot be shared');
    }

    if (profile.suspend) {
      throw new ForbiddenException('Suspended profile cannot be shared');
    }

    let slug = profile.shareSlug;

    if (!slug) {
      slug = this.buildSlug(profile.profileName);

      await this.prisma.profile.update({
        where: { id: profileId },
        data: { shareSlug: slug },
      });
    }

    const shareUrl = this.buildShareUrl(slug);

    const qrCodeDataUrl = await QRCode.toDataURL(shareUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 400,
    });

    return {
      profileId: profile.id,
      profileName: profile.profileName,
      imageUrl: profile.imageUrl,
      shareUrl,
      qrCodeDataUrl,
    };
  }

  async getPublicProfileBySlug(slug: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { shareSlug: slug },
      select: {
        id: true,
        userId: true,
        profileName: true,
        bio: true,
        shareSlug:true,
        imageUrl: true,
        instagramHandler: true,
        accountType: true,
        suspend: true,
        isActive: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Shared profile not found');
    }

    if (profile.accountType !== 'PUBLIC' || profile.suspend) {
      throw new ForbiddenException('This profile is not publicly accessible');
    }

    return {
    userId: profile.userId,
    profileId: profile.id,
    slug: profile.shareSlug,
    profileName: profile.profileName,
    bio: profile.bio,
    imageUrl: profile.imageUrl,
    instagramHandler: profile.instagramHandler,
    accountType: profile.accountType,
    suspend: profile.suspend,
    isActive: profile.isActive,
  };
  }
  async increaseShareCount(profileId: string) {
    await this.prisma.user.updateMany({
      where: {
        activeProfileId: profileId,
      },
      data: {
        shareCount: {
          increment: 1,
        },
      },
    });

    await this.prisma.profile.update({
      where: { id: profileId },
      data: {
        shareCount: {
          increment: 1,
        },
      },
    });
  }
}