import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;

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
      html: `<b>Your code: ${code}</b>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
