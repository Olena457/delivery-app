import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('webhook/telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  @HttpCode(200)
  async receiveUpdate(@Body() update: any) {
    return this.telegramService.handleUpdate(update);
  }
}
