import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../common/mail/mail.service';
import type { SignOptions } from 'jsonwebtoken';
import { SignUpDto } from './dto/signup.dto';
import { generateOtp, otpExpiry } from '@/common/utils/otp';
import {
  AccountType,
  IsActive,
  Preference,
  Role,
  Type,
} from 'generated/prisma/enums';
import { randomUUID } from 'crypto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { getFirebaseAuth } from '@/common/firebase/firebase-admin';
import { OAuth2Client } from 'google-auth-library';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mail: MailService,
  ) {}

  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  private async hash(data: string) {
    return bcrypt.hash(data, 10);
  }

  private async compare(raw: string, hashed: string) {
    return bcrypt.compare(raw, hashed);
  }

  private generateTempLoginToken() {
    return randomUUID();
  }

  private signAccessToken(user: { id: string; role: string; email: string }) {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw new Error('JWT_ACCESS_SECRET is missing');

    const expiresIn = (process.env.JWT_ACCESS_EXPIRES ||
      '15m') as SignOptions['expiresIn'];

    return this.jwt.sign(
      { sub: user.id, role: user.role, email: user.email },
      {
        secret,
        expiresIn,
      },
    );
  }

  private signRefreshToken(user: { id: string; role: string; email: string }) {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error('JWT_REFRESH_SECRET is missing');

    const expiresIn = (process.env.JWT_REFRESH_EXPIRES ||
      '7d') as SignOptions['expiresIn'];

    return this.jwt.sign(
      { sub: user.id, role: user.role, email: user.email },
      {
        secret,
        expiresIn,
      },
    );
  }

  private async createProfileByType(
    tx: any,
    userId: string,
    dto: {
      username?: string;
      profileType?: Type;
      preference?: Preference | null;
      bio?: string | null;
      imageUrl?: string | null;
      instagramHandler?: string | null;
      accountType?: AccountType;
      locationStatus?: boolean;
      creator?: {
        creatorCategory?: string;
        youtubeChanel?: string;
        portfolioWebsite?: string;
      };
      business?: {
        businessCategory?: string;
        businessName?: string;
        location?: string;
      };
      proDriver?: {
        racingDiscipline?: string;
        location?: string;
      };
    },
  ) {
    if (!dto.profileType) {
      throw new BadRequestException('profileType is required');
    }

    const profile = await tx.profile.create({
      data: {
        userId,
        profileName: dto.username ?? null,
        activeType: dto.profileType,
        preference: dto.preference ?? null,
        bio: dto.bio ?? null,
        imageUrl: dto.imageUrl ?? null,
        instagramHandler: dto.instagramHandler ?? null,
        accountType: dto.accountType ?? AccountType.PUBLIC,
        isActive: IsActive.ACTIVE,
        suspend: false,
        locationStatus: dto.locationStatus ?? false,
      },
      select: { id: true },
    });

    await tx.user.update({
      where: { id: userId },
      data: {
        activeProfileId: profile.id,
      },
    });

    switch (dto.profileType) {
      case Type.SPOTTER:
        await tx.spotterProfile.create({
          data: { profileId: profile.id },
        });
        break;

      case Type.OWNER:
        await tx.ownerProfile.create({
          data: { profileId: profile.id },
        });
        break;

      case Type.CONTENT_CREATOR:
        await tx.contentCreatorProfile.create({
          data: {
            profileId: profile.id,
            creatorCategory: dto.creator?.creatorCategory ?? undefined,
            youtubeChanel: dto.creator?.youtubeChanel ?? undefined,
            portfolioWebsite: dto.creator?.portfolioWebsite ?? undefined,
          },
        });
        break;

      case Type.PRO_BUSSINESS:
        if (!dto.business?.businessName || !dto.business?.location) {
          throw new BadRequestException(
            'businessName and location are required for BUSINESS profile',
          );
        }

        await tx.businessProfile.create({
          data: {
            profileId: profile.id,
            businessCategory: dto.business.businessCategory ?? undefined,
            businessName: dto.business.businessName,
            location: dto.business.location,
          },
        });
        break;

      case Type.PRO_DRIVER:
        if (!dto.proDriver?.location) {
          throw new BadRequestException(
            'location is required for PRO_DRIVER profile',
          );
        }

        await tx.proDriverProfile.create({
          data: {
            profileId: profile.id,
            racingDiscipline: dto.proDriver.racingDiscipline ?? undefined,
            location: dto.proDriver.location,
          },
        });
        break;

      case Type.SIM_RACING_DRIVER:
        await tx.simRacingProfile.create({
          data: { profileId: profile.id },
        });
        break;

      default:
        throw new BadRequestException('Invalid profileType');
    }

    return profile;
  }

  async signup(dto: SignUpDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { profile: true },
    });

    const otp = generateOtp(6);
    const expires = otpExpiry(10);
    if (existing && existing.isEmailVerified) {
      throw new BadRequestException('Email already exists');
    }

    if (existing && !existing.isEmailVerified) {
      await this.prisma.user.update({
        where: { id: existing.id },
        data: {
          emailOtp: otp,
          emailOtpExpiresAt: expires,
        },
      });

      await this.mail.sendOtpEmail(existing.email, 'Verify your email', otp);

      return {
        message: 'Email not verified. OTP resent.',
        userId: existing.id,
      };
    }

    const passwordHash = await this.hash(dto.password);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: passwordHash,
          emailOtp: otp,
          emailOtpExpiresAt: expires,
        },
      });

      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          profileName: dto.username,
          activeType: dto.profileType as Type,
          preference: dto.preference ?? null,
          bio: (dto as any).bio ?? null,
          imageUrl: (dto as any).imageUrl ?? null,
          instagramHandler: (dto as any).instagramHandler ?? null,
          accountType: (dto as any).accountType ?? AccountType.PUBLIC,
          isActive: IsActive.ACTIVE,
          suspend: false,
        },
        select: { id: true },
      });

      await tx.user.update({
        where: { id: user.id },
        data: {
          activeProfileId: profile.id,
        },
      });

      switch (dto.profileType) {
        case 'SPOTTER':
          await tx.spotterProfile.create({
            data: { profileId: profile.id },
          });
          break;

        case 'OWNER':
          await tx.ownerProfile.create({
            data: { profileId: profile.id },
          });
          break;

        case 'CONTENT_CREATOR':
          await tx.contentCreatorProfile.create({
            data: {
              profileId: profile.id,
              creatorCategory:
                (dto as any).creator?.creatorCategory ?? undefined,
              youtubeChanel: (dto as any).creator?.youtubeChanel ?? undefined,
              portfolioWebsite:
                (dto as any).creator?.portfolioWebsite ?? undefined,
            },
          });
          break;

        case 'PRO_BUSSINESS': {
          const business = (dto as any).business;
          if (!business?.businessName || !business?.location) {
            throw new BadRequestException(
              'businessName and location are required for BUSINESS profile',
            );
          }
          await tx.businessProfile.create({
            data: {
              profileId: profile.id,
              businessCategory: business.businessCategory ?? undefined,
              businessName: business.businessName,
              location: business.location,
            },
          });
          break;
        }

        case 'PRO_DRIVER': {
          const proDriver = (dto as any).proDriver;
          if (!proDriver?.location) {
            throw new BadRequestException(
              'location is required for PRO_DRIVER profile',
            );
          }
          await tx.proDriverProfile.create({
            data: {
              profileId: profile.id,
              racingDiscipline: proDriver.racingDiscipline ?? undefined,
              location: proDriver.location,
            },
          });
          break;
        }

        case 'SIM_RACING_DRIVER':
          await tx.simRacingProfile.create({
            data: { profileId: profile.id },
          });
          break;

        default:
          throw new BadRequestException('Invalid profileType');
      }

      return user;
    });

    await this.mail.sendOtpEmail(dto.email, 'Verify your email', otp);

    return {
      message: 'Signup successful. OTP sent to email.',
      userId: result.id,
    };
  }

  async verifyEmail(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    if (user.isEmailVerified) return { message: 'Email already verified' };

    if (!user.emailOtp || !user.emailOtpExpiresAt)
      throw new BadRequestException('No OTP found');
    if (user.emailOtp !== otp) throw new BadRequestException('Invalid OTP');
    if (user.emailOtpExpiresAt < new Date())
      throw new BadRequestException('OTP expired');

    await this.prisma.user.update({
      where: { email },
      data: {
        isEmailVerified: true,
        emailOtp: null,
        emailOtpExpiresAt: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  async login(email: string, password: string, loginAs?: Role) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        ambassadorPrograms: true,
        officialPartners: true,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await this.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    if (!user.isEmailVerified) {
      throw new ForbiddenException('Email not verified');
    }

    let selectedRole = user.role;

    if (loginAs === 'AMBASSADOR') {
      if (
        !user.ambassadorPrograms ||
        user.ambassadorPrograms.status !== 'APPROVED'
      ) {
        throw new ForbiddenException('Ambassador not approved');
      }
      selectedRole = 'AMBASSADOR';
    }

    if (loginAs === 'OFFICIAL_PARTNER') {
      if (
        !user.officialPartners ||
        user.officialPartners.requestStatus !== 'APPROVED'
      ) {
        throw new ForbiddenException('Official Partner not approved');
      }
      selectedRole = 'OFFICIAL_PARTNER';
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { activeRole: selectedRole },
    });

    if (user.isTwoFactorEnabled) {
      const otp = generateOtp(6);
      const expires = otpExpiry(10);
      const tempToken = this.generateTempLoginToken();

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorOtp: otp,
          twoFactorOtpExpiresAt: expires,
          twoFactorTempToken: tempToken,
        },
      });

      await this.mail.sendOtpEmail(
        user.email,
        'Your login verification OTP',
        otp,
      );

      return {
        message: 'OTP sent to your email',
        requiresTwoFactor: true,
        tempToken,
      };
    }

    const accessToken = this.signAccessToken({
      id: user.id,
      role: selectedRole,
      email: user.email,
    });

    const refreshToken = this.signRefreshToken({
      id: user.id,
      role: selectedRole,
      email: user.email,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: await this.hash(refreshToken) },
    });

    return {
      message: 'Login successful',
      requiresTwoFactor: false,
      user: {
        id: user.id,
        email: user.email,
        role: selectedRole,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  // async googleAuth(dto: GoogleAuthDto) {
  //   const firebaseAuth = getFirebaseAuth();
  //   const decoded = await firebaseAuth.verifyIdToken(dto.idToken);

  //   const email = decoded.email;
  //   if (!email) {
  //     throw new BadRequestException('Google account email not found');
  //   }

  //   const googleName = decoded.name ?? null;
  //   const googlePicture = decoded.picture ?? null;
  //   const emailVerified = decoded.email_verified ?? true;

  //   let isNewUser = false;

  //   let user = await this.prisma.user.findUnique({
  //     where: { email },
  //     include: {
  //       profile: true,
  //       ambassadorPrograms: true,
  //       officialPartners: true,
  //     },
  //   });

  //   // NEW USER => SIGNUP
  //   if (!user) {
  //     if (!dto.profileType) {
  //       throw new BadRequestException(
  //         'profileType is required for new Google signup',
  //       );
  //     }

  //     const randomPassword = await this.hash(randomUUID());

  //     user = await this.prisma.$transaction(async (tx) => {
  //       const createdUser = await tx.user.create({
  //         data: {
  //           email,
  //           password: randomPassword,
  //           isEmailVerified: emailVerified,
  //         },
  //       });

  //       await this.createProfileByType(tx, createdUser.id, {
  //         username: dto.username ?? googleName ?? email.split('@')[0],
  //         profileType: dto.profileType,
  //         preference: dto.preference ?? null,
  //         bio: dto.bio ?? null,
  //         imageUrl: dto.imageUrl ?? googlePicture,
  //         instagramHandler: dto.instagramHandler ?? null,
  //         accountType: dto.accountType ?? AccountType.PUBLIC,
  //         locationStatus: dto.locationStatus ?? false,
  //         creator: dto.creator,
  //         business: dto.business,
  //         proDriver: dto.proDriver,
  //       });

  //       return tx.user.findUniqueOrThrow({
  //         where: { id: createdUser.id },
  //         include: {
  //           profile: true,
  //           ambassadorPrograms: true,
  //           officialPartners: true,
  //         },
  //       });
  //     });

  //     isNewUser = true;
  //   } else {
  //     // EXISTING USER => SIGNIN
  //     if (!user.isEmailVerified) {
  //       user = await this.prisma.user.update({
  //         where: { id: user.id },
  //         data: {
  //           isEmailVerified: true,
  //           emailOtp: null,
  //           emailOtpExpiresAt: null,
  //         },
  //         include: {
  //           profile: true,
  //           ambassadorPrograms: true,
  //           officialPartners: true,
  //         },
  //       });
  //     }

  //     if (!user.profile || user.profile.length === 0) {
  //       if (!dto.profileType) {
  //         throw new BadRequestException(
  //           'profileType is required because this user has no profile yet',
  //         );
  //       }

  //       await this.prisma.$transaction(async (tx) => {
  //         await this.createProfileByType(tx, user!.id, {
  //           username: dto.username ?? googleName ?? email.split('@')[0],
  //           profileType: dto.profileType,
  //           preference: dto.preference ?? null,
  //           bio: dto.bio ?? null,
  //           imageUrl: dto.imageUrl ?? googlePicture,
  //           instagramHandler: dto.instagramHandler ?? null,
  //           accountType: dto.accountType ?? AccountType.PUBLIC,
  //           locationStatus: dto.locationStatus ?? false,
  //           creator: dto.creator,
  //           business: dto.business,
  //           proDriver: dto.proDriver,
  //         });
  //       });

  //       user = await this.prisma.user.findUniqueOrThrow({
  //         where: { id: user.id },
  //         include: {
  //           profile: true,
  //           ambassadorPrograms: true,
  //           officialPartners: true,
  //         },
  //       });
  //     }
  //   }

  //   let selectedRole = user.role;

  //   if (dto.loginAs === 'AMBASSADOR') {
  //     if (
  //       !user.ambassadorPrograms ||
  //       user.ambassadorPrograms.status !== 'APPROVED'
  //     ) {
  //       throw new ForbiddenException('Ambassador not approved');
  //     }
  //     selectedRole = 'AMBASSADOR';
  //   }

  //   if (dto.loginAs === 'OFFICIAL_PARTNER') {
  //     if (
  //       !user.officialPartners ||
  //       user.officialPartners.requestStatus !== 'APPROVED'
  //     ) {
  //       throw new ForbiddenException('Official Partner not approved');
  //     }
  //     selectedRole = 'OFFICIAL_PARTNER';
  //   }

  //   const updatedUser = await this.prisma.user.update({
  //     where: { id: user.id },
  //     data: { activeRole: selectedRole },
  //     select: {
  //       id: true,
  //       email: true,
  //       activeProfileId: true,
  //     },
  //   });

  //   const accessToken = this.signAccessToken({
  //     id: user.id,
  //     role: selectedRole,
  //     email: user.email,
  //   });

  //   const refreshToken = this.signRefreshToken({
  //     id: user.id,
  //     role: selectedRole,
  //     email: user.email,
  //   });

  //   await this.prisma.user.update({
  //     where: { id: user.id },
  //     data: { refreshTokenHash: await this.hash(refreshToken) },
  //   });

  //   return {
  //     message: isNewUser
  //       ? 'Google signup successful'
  //       : 'Google signin successful',
  //     isNewUser,
  //     user: {
  //       id: updatedUser.id,
  //       email: updatedUser.email,
  //       role: selectedRole,
  //       activeProfileId: updatedUser.activeProfileId,
  //     },
  //     tokens: {
  //       accessToken,
  //       refreshToken,
  //     },
  //   };
  // }

  async googleAuth(dto: GoogleAuthDto) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    throw new BadRequestException('GOOGLE_CLIENT_ID is missing in environment');
  }

  try {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: dto.idToken,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new BadRequestException('Invalid Google token payload');
    }

    const email = payload.email;
    if (!email) {
      throw new BadRequestException('Google account email not found');
    }

    const googleName = payload.name ?? null;
    const googlePicture = payload.picture ?? null;
    const emailVerified = payload.email_verified ?? true;

    let isNewUser = false;

    let user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        ambassadorPrograms: true,
        officialPartners: true,
      },
    });

    // NEW USER => SIGNUP
    if (!user) {
      if (!dto.profileType) {
        throw new BadRequestException(
          'profileType is required for new Google signup',
        );
      }

      const randomPassword = await this.hash(randomUUID());

      user = await this.prisma.$transaction(async (tx) => {
        const createdUser = await tx.user.create({
          data: {
            email,
            password: randomPassword,
            isEmailVerified: emailVerified,
          },
        });

        await this.createProfileByType(tx, createdUser.id, {
          username: dto.username ?? googleName ?? email.split('@')[0],
          profileType: dto.profileType,
          preference: dto.preference ?? null,
          bio: dto.bio ?? null,
          imageUrl: dto.imageUrl ?? googlePicture,
          instagramHandler: dto.instagramHandler ?? null,
          accountType: dto.accountType ?? AccountType.PUBLIC,
          locationStatus: dto.locationStatus ?? false,
          creator: dto.creator,
          business: dto.business,
          proDriver: dto.proDriver,
        });

        return tx.user.findUniqueOrThrow({
          where: { id: createdUser.id },
          include: {
            profile: true,
            ambassadorPrograms: true,
            officialPartners: true,
          },
        });
      });

      isNewUser = true;
    } else {
      // EXISTING USER => SIGNIN
      if (!user.isEmailVerified) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            isEmailVerified: true,
            emailOtp: null,
            emailOtpExpiresAt: null,
          },
          include: {
            profile: true,
            ambassadorPrograms: true,
            officialPartners: true,
          },
        });
      }

      if (!user.profile || user.profile.length === 0) {
        if (!dto.profileType) {
          throw new BadRequestException(
            'profileType is required because this user has no profile yet',
          );
        }

        await this.prisma.$transaction(async (tx) => {
          await this.createProfileByType(tx, user!.id, {
            username: dto.username ?? googleName ?? email.split('@')[0],
            profileType: dto.profileType,
            preference: dto.preference ?? null,
            bio: dto.bio ?? null,
            imageUrl: dto.imageUrl ?? googlePicture,
            instagramHandler: dto.instagramHandler ?? null,
            accountType: dto.accountType ?? AccountType.PUBLIC,
            locationStatus: dto.locationStatus ?? false,
            creator: dto.creator,
            business: dto.business,
            proDriver: dto.proDriver,
          });
        });

        user = await this.prisma.user.findUniqueOrThrow({
          where: { id: user.id },
          include: {
            profile: true,
            ambassadorPrograms: true,
            officialPartners: true,
          },
        });
      }
    }

    let selectedRole = user.role;

    if (dto.loginAs === 'AMBASSADOR') {
      if (
        !user.ambassadorPrograms ||
        user.ambassadorPrograms.status !== 'APPROVED'
      ) {
        throw new ForbiddenException('Ambassador not approved');
      }
      selectedRole = 'AMBASSADOR';
    }

    if (dto.loginAs === 'OFFICIAL_PARTNER') {
      if (
        !user.officialPartners ||
        user.officialPartners.requestStatus !== 'APPROVED'
      ) {
        throw new ForbiddenException('Official Partner not approved');
      }
      selectedRole = 'OFFICIAL_PARTNER';
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { activeRole: selectedRole },
      select: {
        id: true,
        email: true,
        activeProfileId: true,
      },
    });

    const accessToken = this.signAccessToken({
      id: user.id,
      role: selectedRole,
      email: user.email,
    });

    const refreshToken = this.signRefreshToken({
      id: user.id,
      role: selectedRole,
      email: user.email,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: await this.hash(refreshToken) },
    });

    return {
      message: isNewUser
        ? 'Google signup successful'
        : 'Google signin successful',
      isNewUser,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: selectedRole,
        activeProfileId: updatedUser.activeProfileId,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  } catch (error: any) {
    throw new BadRequestException(
      error?.message || 'Invalid Google ID token',
    );
  }
}

  async verifyLoginOtp(tempToken: string, otp: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        twoFactorTempToken: tempToken,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid or expired temporary login session',
      );
    }

    if (!user.twoFactorOtp || !user.twoFactorOtpExpiresAt) {
      throw new BadRequestException('No OTP found for login verification');
    }

    if (user.twoFactorOtp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (user.twoFactorOtpExpiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    const roleToUse = user.activeRole ?? user.role;

    const accessToken = this.signAccessToken({
      id: user.id,
      role: roleToUse,
      email: user.email,
    });

    const refreshToken = this.signRefreshToken({
      id: user.id,
      role: roleToUse,
      email: user.email,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash: await this.hash(refreshToken),
        twoFactorOtp: null,
        twoFactorOtpExpiresAt: null,
        twoFactorTempToken: null,
      },
    });

    return {
      message: 'Login successful',
      requiresTwoFactor: false,
      user: {
        id: user.id,
        email: user.email,
        role: roleToUse,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async resendLoginOtp(tempToken: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        twoFactorTempToken: tempToken,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid or expired temporary login session',
      );
    }

    if (!user.isTwoFactorEnabled) {
      throw new BadRequestException('Two-factor authentication is disabled');
    }

    const otp = generateOtp(6);
    const expires = otpExpiry(10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorOtp: otp,
        twoFactorOtpExpiresAt: expires,
      },
    });

    await this.mail.sendOtpEmail(
      user.email,
      'Your login verification OTP',
      otp,
    );

    return {
      message: 'OTP resent successfully',
    };
  }

  async toggleTwoFactor(userId: string, enabled: boolean) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isTwoFactorEnabled: enabled,
        ...(enabled
          ? {}
          : {
              twoFactorOtp: null,
              twoFactorOtpExpiresAt: null,
              twoFactorTempToken: null,
            }),
      },
    });

    return {
      message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully`,
      isTwoFactorEnabled: enabled,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshTokenHash)
      throw new UnauthorizedException('Access denied');

    const matched = await this.compare(refreshToken, user.refreshTokenHash);
    if (!matched) throw new UnauthorizedException('Access denied');

    const accessToken = this.signAccessToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });
    const newRefreshToken = this.signRefreshToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: await this.hash(newRefreshToken) },
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    return { message: 'Logged out' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'If email exists, OTP sent.' };

    const otp = generateOtp(6);
    const expires = otpExpiry(10);

    await this.prisma.user.update({
      where: { email },
      data: { resetOtp: otp, resetOtpExpiresAt: expires },
    });

    await this.mail.sendOtpEmail(email, 'Reset your password', otp);

    return { message: 'If email exists, OTP sent.' };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('Invalid request');

    if (!user.resetOtp || !user.resetOtpExpiresAt)
      throw new BadRequestException('No OTP found');
    if (user.resetOtp !== otp) throw new BadRequestException('Invalid OTP');
    if (user.resetOtpExpiresAt < new Date())
      throw new BadRequestException('OTP expired');

    const newHash = await this.hash(newPassword);

    await this.prisma.user.update({
      where: { email },
      data: {
        password: newHash,
        resetOtp: null,
        resetOtpExpiresAt: null,
        refreshTokenHash: null,
      },
    });

    return { message: 'Password reset successful' };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Access denied');

    const ok = await this.compare(currentPassword, user.password);
    if (!ok) throw new BadRequestException('Current password incorrect');

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: await this.hash(newPassword),
        refreshTokenHash: null,
      },
    });

    return { message: 'Password changed successfully' };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User is Not Found');

    return user;
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        isEmailVerified: true,
        isTwoFactorEnabled: true,
        totalPoints: true,
        balance: true,
        likeCount: true,
        totalVote: true,
        commentCount: true,
        shareCount: true,
        createdAt: true,
        updatedAt: true,

        profile: {},
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async deleteMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return {
      message: 'User deleted',
    };
  }
}
