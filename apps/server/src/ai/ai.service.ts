import { Injectable, InternalServerErrorException } from '@nestjs/common';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  error?: {
    message: string;
  };
}

@Injectable()
export class AiService {
  private readonly apiKey = process.env.GEMINI_API_KEY;
  private readonly apiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      });

      const data = (await response.json()) as GeminiResponse;

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch Gemini API');
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiText) {
        throw new Error('Empty response from AI');
      }

      return aiText;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'AI Service is currently unavailable',
      );
    }
  }
}
