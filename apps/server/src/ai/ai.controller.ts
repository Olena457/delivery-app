import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('assistant')
  @ApiOperation({ summary: 'Chat with AI Assistant about menu and food' })
  async askAssistant(
    @Body('question') question: string,
  ): Promise<{ answer: string }> {
    if (!question) {
      throw new BadRequestException('Question is required for AI Assistant');
    }

    const answer = await this.aiService.generateResponse(question);

    return { answer };
  }
}
