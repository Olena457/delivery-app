// import { Update, Start, On, Message, Command } from 'nestjs-telegraf';
// import { Context } from 'telegraf';
// import { AiService } from '../ai/ai.service';
// import { PrismaService } from '../common/prisma/prisma.service';
// import { Injectable } from '@nestjs/common';
// @Update()
// @Injectable()
// export class TelegramUpdate {
//   constructor(
//     private readonly aiService: AiService,
//     private readonly prisma: PrismaService,
//   ) {}

//   @Start()
//   async onStart(ctx: Context) {
//     await ctx.reply(
//       'Hi!😉🍕 I am your AI delivery assistant.\nAsk me about our menu, prices, or shops!',
//     );
//   }

//   @Command('stop')
//   async onStop(ctx: Context) {
//     await ctx.reply(
//       'Goodbye! Hope to see you soon. Type /start if you need me again.',
//     );
//   }

//   @On('text')
//   async onMessage(@Message('text') text: string, ctx: Context) {
//     try {
//       await ctx.sendChatAction('typing');

//       const products = await this.prisma.product.findMany({
//         where: { isAvailable: true },
//         include: {
//           shop: true,
//           category: true,
//         },
//         take: 5,
//       });

//       const productsList = products
//         .map(
//           (p) =>
//             `- ${p.title} (${p.category.name}) from ${p.shop.name}: ${p.price} UAH. ${p.tags ? `Tags: ${p.tags}` : ''}`,
//         )
//         .join('\n');

//       const shops = [...new Set(products.map((p) => p.shop.name))].join(', ');

//       const prompt = `
//         You are a specialized AI assistant for the "Delivery App" food delivery platform.

//         CONTEXT:
//         - Available shops: ${shops}
//         - Current menu items:
//         ${productsList}

//         RULES:
//         1. LANGUAGE: Detect the language of the user's question and respond in that SAME language (e.g., if asked in Ukrainian, answer in Ukrainian).
//         2. TOPIC: Only answer questions about food, drinks, delivery, menu, prices, or our partner shops.
//         3. OFF-TOPIC: If the user asks about anything unrelated (coding, politics, general chat), politely say that you are specialized only in food delivery and cannot assist with other topics.
//         4. ACCURACY: If a product is not in the list, say we don't have it but suggest something similar from the menu above.
//         5. TONE: Be friendly, helpful, and concise.

//         User's question: "${text}"
//       `;

//       const aiResponse = await this.aiService.generateResponse(prompt);
//       await ctx.reply(aiResponse);
//     } catch (error) {
//       console.error('Telegram Bot Error:', error);
//       await ctx.reply(
//         'Sorry, I am having some trouble thinking right now. Please try again later!',
//       );
//     }
//   }
// }
import { Update, Start, On, Message, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Update()
@Injectable()
export class TelegramUpdate {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {}

  @Start()
  async onStart(ctx: Context) {
    await ctx.reply(
      'Hi!😉🍕 I am your AI delivery assistant.\nAsk me about our menu, prices, or shops!',
    );
  }

  @Command('stop')
  async onStop(ctx: Context) {
    await ctx.reply(
      'Goodbye! Hope to see you soon. Type /start if you need me again.',
    );
  }

  @On('text')
  async onMessage(@Message('text') text: string, ctx: Context) {
    console.log('Повідомлення прийшло:', text);

    try {
      // 1. Показуємо статус "друкує"
      await ctx.sendChatAction('typing');

      // 2. Отримуємо дані з бази
      const products = await this.prisma.product.findMany({
        where: { isAvailable: true },
        include: {
          shop: true,
          category: true,
        },
        take: 10,
      });

      // 3. Формуємо список для AI
      const productsList = products
        .map(
          (p) =>
            `- ${p.title} (${p.category.name}) from ${p.shop.name}: ${p.price} UAH.`,
        )
        .join('\n');

      const shops = [...new Set(products.map((p) => p.shop.name))].join(', ');

      // 4. Формуємо промт
      const prompt = `
        You are a specialized AI assistant for the "Delivery App" food delivery platform.
        CONTEXT:
        - Available shops: ${shops}
        - Current menu items:
        ${productsList}

        RULES:
        1. LANGUAGE: Respond in the SAME language as the user.
        2. TOPIC: Only food delivery topics.
        User's question: "${text}"
      `;

      // 5. Отримуємо відповідь від AI
      const aiResponse = await this.aiService.generateResponse(prompt);

      // 6. Надсилаємо відповідь користувачу
      await ctx.reply(aiResponse);
    } catch (error) {
      console.error('Telegram Bot Error:', error);
      // Якщо впав AI, відправимо хоча б просту відповідь, щоб перевірити зв'язок
      await ctx.reply(
        'Я бачу твоє повідомлення, але виникла помилка при генерації відповіді ШІ.',
      );
    }
  }
}
