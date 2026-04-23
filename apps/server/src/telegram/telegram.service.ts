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

    try {
      const lastMessages = await this.prisma.telegramMessage.findMany({
        where: { chatId },
        take: 6,
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

      const messagesToKeep = await this.prisma.telegramMessage.findMany({
        where: { chatId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true },
      });

      const idsToKeep = messagesToKeep.map((m) => m.id);

      await this.prisma.telegramMessage.deleteMany({
        where: {
          chatId,
          id: { notIn: idsToKeep },
        },
      });

      await this.bot.telegram.sendMessage(chatId, aiAnswer, {
        parse_mode: 'Markdown',
      });
    } catch (error) {
      console.error('Error in TelegramService:', error);
      await this.bot.telegram.sendMessage(
        chatId,
        'Sorry, an error occurred. Please try again later.😞',
      );
    }
  }
}
