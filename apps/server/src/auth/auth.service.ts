import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async requestCode(email: string): Promise<{ message: string }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await this.prisma.verificationCode.upsert({
      where: { email },
      update: { code, expiresAt },
      create: { email, code, expiresAt },
    });

    await this.mailService.sendCode(email, code);

    return { message: 'Verification code has been sent to your email.' };
  }

  async verifyCode(
    email: string,
    code: string,
  ): Promise<{ access_token: string }> {
    const record = await this.prisma.verificationCode.findUnique({
      where: { email },
    });

    if (!record || record.code !== code) {
      throw new BadRequestException('Invalid code.');
    }

    if (new Date() > new Date(record.expiresAt)) {
      throw new BadRequestException('The verification code has expired.');
    }

    await this.prisma.verificationCode.delete({
      where: { email },
    });

    const payload = { email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
