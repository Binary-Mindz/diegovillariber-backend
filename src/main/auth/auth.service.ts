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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mail: MailService,
  ) {}

  private async hash(data: string) {
    return bcrypt.hash(data, 10);
  }

  private async compare(raw: string, hashed: string) {
    return bcrypt.compare(raw, hashed);
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

  async signup(dto: SignUpDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { profile: true },
    });

    const otp = generateOtp(6);
    const expires = otpExpiry(10);

    // ✅ Case 1: user exists & email already verified
    if (existing && existing.isEmailVerified) {
      throw new BadRequestException('Email already exists');
    }

    // 🔁 Case 2: user exists but NOT verified → resend OTP
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

    // ✅ Case 3: fresh signup
    const passwordHash = await this.hash(dto.password);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: passwordHash,
          emailOtp: otp,
          emailOtpExpiresAt: expires,
        },
      });

      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          preference: dto.preference,
          profileType: dto.profileType,
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

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        password: true,
        isEmailVerified: true,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await this.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    if (!user.isEmailVerified) {
      throw new ForbiddenException('Email not verified');
    }

    const accessToken = this.signAccessToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    const refreshToken = this.signRefreshToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    // store hash of refresh token
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: await this.hash(refreshToken) },
    });

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
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
        refreshTokenHash: null, // force re-login everywhere
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
}
