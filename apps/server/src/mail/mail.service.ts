// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';
// import { ConfigService } from '@nestjs/config';
// import { Transporter } from 'nodemailer';

// @Injectable()
// export class MailService {
//   private transporter: Transporter;

//   constructor(private configService: ConfigService) {
//     this.transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 465,
//       secure: true,
//       auth: {
//         user: this.configService.get<string>('EMAIL_USER'),
//         pass: this.configService.get<string>('EMAIL_PASS'),
//       },
//     });
//   }

//   async sendCode(email: string, code: string): Promise<void> {
//     const mailOptions = {
//       from: `"Delivery App" <${this.configService.get<string>('EMAIL_USER')}>`,
//       to: email,
//       subject: 'Your Verification Code',
//       html: `<b>Your code: ${code}</b>`,
//     };

//     await this.transporter.sendMail(mailOptions);
//   }
// }
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendCode(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: `"Delivery App" <${this.configService.get<string>('EMAIL_USER')}>`,
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #333;">Verification Code</h2>
          <p style="font-size: 16px; color: #555;">Please use the following code to access your order history:</p>
          <div style="background: #f4f4f4; padding: 15px; font-size: 28px; font-weight: bold; text-align: center; letter-spacing: 8px; color: #000; border-radius: 4px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #888; font-size: 14px; margin-top: 20px;">
            This code is valid for 10 minutes. If you did not request this code, please ignore this email.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Code successfully sent to: ${email}`);
    } catch (error: unknown) {
      this.logger.error(`Failed to send email to ${email}:`, error);

      throw new InternalServerErrorException(
        'Failed to send verification email. Please check SMTP settings or App Password.',
      );
    }
  }
}
