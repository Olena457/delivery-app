import { Update, Start, On, Message, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../common/prisma/prisma.service';

@Update()
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
    try {
      await ctx.sendChatAction('typing');

      //get available products from DB
      const products = await this.prisma.product.findMany({
        where: { isAvailable: true },
        include: {
          shop: true,
          category: true,
        },
        take: 8, //limit to 8 products
      });

      const productsList = products
        .map(
          (p) =>
            `- ${p.title} (${p.category.name}) in ${p.shop.name}: ${p.price} UAH. Description: ${p.description || 'N/A'}. Tags: ${p.tags || ''}`,
        )
        .join('\n');

      //prompt for AI
      const prompt = `
        You are a helpful assistant for a food delivery platform. 
        Current available products:
        ${productsList}

        User's question: "${text}"

        Your instructions:
        - Answer in English.
        - Be friendly and professional.
        - If the user asks for a specific product, check if we have it in the list above.
        - If we don't have it, suggest the closest alternative.
        - If they ask about shops, mention ${[...new Set(products.map((p) => p.shop.name))].join(', ')}.
      `;

      // use AiService (Gemini)
      const aiResponse = await this.aiService.generateResponse(prompt);

      // send response back to user
      await ctx.reply(aiResponse);
    } catch (error) {
      console.error('Telegram Bot Error:', error);
      await ctx.reply(
        'Sorry, I am having some trouble thinking right now. Please try again later!',
      );
    }
  }
}
