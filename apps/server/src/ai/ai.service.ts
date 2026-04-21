import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

interface MistralErrorResponse {
  message: string;
  type: string;
  param: string | null;
  code: string;
}

export interface MistralResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

@Injectable()
export class AiService {
  private readonly apiUrl = 'https://api.mistral.ai/v1/chat/completions';
  private readonly apiKey = process.env.MISTRAL_API_KEY;

  constructor(private prisma: PrismaService) {}

  async generateResponse(question: string): Promise<string> {
    const fallbackMessage = 'Вибачте, сталася помилка зʼєднання. 🛠️';

    try {
      // 1. Отримуємо більше продуктів, щоб збільшити шанс знайти теги (наприклад, 20)
      const products = await this.prisma.product.findMany({
        where: { isAvailable: true },
        include: {
          shop: true,
          category: true,
        },
        take: 20,
      });

      // 2. ФОРМУЄМО ДАНІ З ТЕГАМИ (Це найважливіша зміна!)
      const productContext = products.map((p) => ({
        name: p.title,
        price: `${p.price} UAH`,
        category: p.category.name,
        shop: p.shop.name,
        description: p.description || '',
        // Додаємо характеристики, щоб ШІ міг за ними фільтрувати
        characteristics: p.tags ? p.tags.split(',') : [],
      }));

      // 3. ФОРМУЄМО СИСТЕМНУ ІНСТРУКЦІЮ (копіюємо логіку з твого старого коду)
      const systemInstruction = `
        Identity: You are a professional Food Delivery Assistant. 
        Context: Today is ${new Date().toLocaleDateString()}.
        
        DATA SOURCE (Available Items):
        ${JSON.stringify(productContext)}
        
        STRICT BEHAVIOR RULES:
        1. LANGUAGE: Respond ONLY in the same language the user addresses you.
        2. TOPIC: Focus strictly on menu and shops.
        3. EMOJI LOGIC: 
           - Use 🌶️ for spicy dishes (characteristics includes "spicy").
           - Use 🌽 for vegan (characteristics includes "vegan").
           - Use 🆕 for new (characteristics includes "new").
           - Use 💰 for promo (characteristics includes "promo").
        4. FILTERING: If user asks for "spicy", look strictly into the "characteristics" array.
        5. STYLE: Bold **Shop Names** and **Prices**. Use lists for results.
      `;

      // 4. ВІДПРАВЛЯЄМО ЗАПИТ ДО MISTRAL
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'open-mistral-7b',
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: question },
          ],
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const errorData = (await res.json()) as MistralErrorResponse;
        console.error('Mistral API Error:', errorData);
        return `Помилка API: ${errorData.message || fallbackMessage}`;
      }

      const data = (await res.json()) as MistralResponse;
      return data.choices[0]?.message?.content || fallbackMessage;
    } catch (error) {
      console.error('AI Service Exception:', error);
      return fallbackMessage;
    }
  }
}
