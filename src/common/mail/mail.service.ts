import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOtp(to: string, otp: string, subject = 'Your Verification Code') {
    const text = `Your OTP code is: ${otp}\nThis code will expire in 5 minutes.`;

    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
  }

  async forgetPassOtp(
    to: string,
    otp: string,
    subject = 'Reset Your Password',
  ) {
    const text = `You requested a password reset.\nYour OTP code is: ${otp}\nThis code will expire in 5 minutes.`;

    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
  }
}
