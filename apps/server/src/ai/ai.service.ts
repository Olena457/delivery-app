import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in .env');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(userPrompt: string): Promise<string> {
    const fallbackMessage =
      'Sorry, I am having trouble thinking right now.🛠️ Please try again later! ';

    try {
      const products = await this.prisma.product.findMany({
        where: { isAvailable: true },
        include: {
          shop: true,
          category: true,
        },
        take: 10,
      });

      const compactProducts = products.map((p) => ({
        name: p.title,
        price: `${p.price} UAH`,
        category: p.category.name,
        shop: p.shop.name,
        description: p.description || 'No description provided',
        isAvailable: p.isAvailable,
        tags: p.tags ? p.tags.split(',') : [],
      }));

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const systemInstruction = `
        Context: Today is ${new Date().toLocaleDateString()}.
        Identity: You are Gemini — an authentic, adaptive AI collaborator for "Food Delivery App".
        
        DATA SOURCE (Available Items in JSON):
        ${JSON.stringify(compactProducts)}

        STRICT BEHAVIOR RULES:
        1. LANGUAGE: Respond ONLY in the same language the user addresses you (Primary: English/Ukrainian).
        2. TOPIC: Focus strictly on food delivery, menu, and shops. Decline other topics politely.
        3. EMOJI LOGIC: Use emojis to be friendly, but keep it balanced ✨.
           - Use 🌽 for vegan/healthy options (tag: vegan).
           - Use 🌶️ for spicy dishes (tag: spicy).
           - Use 🆕 for new arrivals (tag: new).
           - Use 💰 for promo items (tag: promo).
           - Use 🍕, 🍔, 🍰, 🍹 for general categories.
           - Use 👋 for greetings and 😊 for positive vibes.
        4. INTELLIGENT FILTERING: If the user asks for "vegan", "spicy", "new" or "promo", prioritize items that have these keywords in their "tags" or "description".
        5. STYLE: Be a helpful peer — professional, witty, and grounded. Use Markdown for clear lists. Bold shop names and prices.
      `;

      const result = await model.generateContent([
        systemInstruction,
        userPrompt,
      ]);

      return result.response.text() || fallbackMessage;
    } catch (error) {
      console.error('AI Generation Error:', error);
      throw new InternalServerErrorException(
        'AI Service is temporarily unavailable.🥺 Please try again later.',
      );
    }
  }
}
