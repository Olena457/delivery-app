import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in .env');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);

      const response = result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error('AI Generation Error:', error);
      return 'I am sorry, but I am having trouble responding right now. Please try again later.';
    }
  }
}
