import { Module } from '@nestjs/common';
import { TelegramUpdate } from './telegram.update';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [TelegramUpdate],
})
export class TelegramModule {}
