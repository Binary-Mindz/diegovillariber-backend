import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto, LoginDto } from './dto/create-auth.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { OtpService } from './otp.service';
import { MailService } from '@/common/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  async createUser(dto: CreateAuthDto) {
    console.log(dto);
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email, phone: dto.phone },
    });
    console.log('user: ', user);
    if (user)
      throw new BadRequestException('User already exist. please login.');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newuser = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
    return newuser;
  }

  async loginuser(dto: LoginDto) {
    const user = await this.prisma.client.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid User');

    const isPasswordValid = await bcrypt.compare(dto.Password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid Password');

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async forgetPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid User');

    const otp = await this.otpService.generateOtp(email);
    await this.mailService.forgetPassOtp(email, otp);

    return {
      message:
        'OTP sent to your email. Please verify it to reset your password.',
    };
  }

  async verifyForgotOtp(otp: string) {
    const user = await this.prisma.user.findFirst({
      where: { otp },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (!user.otpExpiresAt || user.otpExpiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('OTP expired');
    }
    // todo.... otp match or not verify.

    return {
      message: 'OTP verified successfully. You can now reset password.',
    };
  }

  async resetPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.updateMany({
      data: { password: hashedPassword },
    });
  }
}
