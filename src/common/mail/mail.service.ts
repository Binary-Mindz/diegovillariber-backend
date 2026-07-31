import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendOtpEmail(to: string, subject: string, otp: string) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>OTP Verification</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding: 40px 10px;">
                <table width="100%" max-width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background:#2563eb; padding:20px; text-align:center;">
                      <h1 style="color:#ffffff; margin:0; font-size:20px;">
                        OTP Verification
                      </h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:30px; color:#333333;">
                      <p style="margin:0 0 16px; font-size:15px;">
                        Hello,
                      </p>
                      <p style="margin:0 0 20px; font-size:15px; line-height:1.6;">
                        Use the following One-Time Password (OTP) to complete your verification.
                      </p>

                      <!-- OTP Box -->
                      <div style="text-align:center; margin:30px 0;">
                        <span style="
                          display:inline-block;
                          padding:14px 28px;
                          font-size:24px;
                          font-weight:bold;
                          letter-spacing:6px;
                          color:#2563eb;
                          background:#eef2ff;
                          border-radius:6px;
                        ">
                          ${otp}
                        </span>
                      </div>

                      <p style="margin:0 0 12px; font-size:14px; color:#555;">
                        ⏳ This OTP will expire in a few minutes.
                      </p>
                      <p style="margin:0; font-size:14px; color:#555;">
                        If you didn’t request this, please ignore this email.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f1f5f9; padding:16px; text-align:center; font-size:12px; color:#666;">
                      © ${new Date().getFullYear()} Your Company Name. All rights reserved.
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    });
  }
}
