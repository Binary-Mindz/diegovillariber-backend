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
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await this.prisma.otp.create({
      data: { email, otp, expiresAt },
    });

    return otp;
  }

  async verifyOtp(otp: string) {
    const record = await this.prisma.otp.findFirst({
      where: { otp, verified: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) throw new UnauthorizedException('Invalid OTP');
    if (record.expiresAt < new Date())
      throw new UnauthorizedException('OTP expired');

    await this.prisma.otp.update({
      where: { id: record.id },
      data: { verified: true },
    });

    return record.id;
  }
}
