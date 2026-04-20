import { Module } from '@nestjs/common';
import { TelegramUpdate } from './telegram.update';
import { AiModule } from '../ai/ai.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [AiModule, PrismaModule],
  providers: [TelegramUpdate],
})
export class TelegramModule {}
