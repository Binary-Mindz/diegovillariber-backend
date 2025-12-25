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
    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 0;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
            
            <!-- HEADER -->
            <tr>
              <td style="background:#4f46e5; padding:20px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:24px;">
                  Forget Password Requst
                </h1>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:30px;">
                <p style="font-size:16px; color:#333333; margin-bottom:15px;">
                  Hello,
                </p>

                <p style="font-size:15px; color:#555555; line-height:1.6;">
                  You recently requested to reset your password.  
                  Please use the OTP below to proceed.
                </p>

                <!-- OTP BOX -->
                <div style="margin:30px 0; text-align:center;">
                  <span style="
                    display:inline-block;
                    background:#f1f5f9;
                    color:#111827;
                    font-size:28px;
                    letter-spacing:6px;
                    padding:15px 30px;
                    border-radius:8px;
                    font-weight:bold;
                  ">
                    ${otp}
                  </span>
                </div>

                <p style="font-size:14px; color:#555555;">
                  ⏳ This OTP will expire in <strong>5 minutes</strong>.
                </p>

                <p style="font-size:14px; color:#777777; margin-top:20px;">
                  If you did not request a password reset, please ignore this email.
                </p>

                <p style="font-size:14px; color:#333333; margin-top:30px;">
                  Regards,<br />
                  <strong>Your Support Team</strong>
                </p>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:#f9fafb; padding:15px; text-align:center;">
                <p style="font-size:12px; color:#9ca3af; margin:0;">
                  © ${new Date().getFullYear()} Johnb. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
  }
}
