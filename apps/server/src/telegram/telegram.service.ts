import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { PrismaService } from '../common/prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { TelegramUpdateDto } from './dto/telegram.dto';

@Injectable()
export class TelegramService {
  private bot: Telegraf;

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in .env');
    }
    this.bot = new Telegraf(token);
  }

  async processUpdate(update: TelegramUpdateDto) {
    const message = update.message;

    if (!message || !message.text) return;

    const chatId = message.chat.id.toString();

    const lastMessages = await this.prisma.telegramMessage.findMany({
      where: { chatId: chatId },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    const history = lastMessages.reverse().map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const aiAnswer = await this.aiService.generateTelegramResponse(
      message.text,
      history,
    );

    await this.prisma.telegramMessage.createMany({
      data: [
        { chatId, role: 'user', content: message.text },
        { chatId, role: 'assistant', content: aiAnswer },
      ],
    });

    await this.bot.telegram.sendMessage(chatId, aiAnswer, {
      parse_mode: 'Markdown',
    });
  }
}
