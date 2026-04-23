import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { AiModule } from '../ai/ai.module';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [AiModule, PrismaModule],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}
