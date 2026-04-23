import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramUpdateDto } from './dto/telegram.dto';
@Controller('webhook/telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  @HttpCode(200)
  async receiveUpdate(@Body() update: TelegramUpdateDto) {
    return this.telegramService.processUpdate(update);
  }
}
