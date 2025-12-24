import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MailService } from '@/common/mail/mail.service';

@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async generateOtp(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid User');

    await this.prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpiresAt: expiresAt,
      },
    });

    return otp;
  }
  async verifyOtp(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.otp || !user.otpExpiresAt) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (user.otp !== otp) {
      throw new UnauthorizedException('Incorrect OTP');
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('OTP expired');
    }

    await this.prisma.user.update({
      where: { email },
      data: {
        otp: null,
        otpExpiresAt: null,
      },
    });

    return true;
  }
}
