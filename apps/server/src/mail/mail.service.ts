import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  async sendCode(email: string, code: string) {
    // logger for debugging purposes, remove in production
    this.logger.debug(`[DEBUG] Verification code for ${email}: ${code}`);

    await this.resend.emails.send({
      from: 'Delivery App <onboarding@resend.dev>',
      to: email,
      subject: 'Verification code',
      html: `<strong>Your code: ${code}</strong>`,
    });
  }
}
