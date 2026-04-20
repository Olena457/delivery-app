import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Додаємо ConfigService для безпеки
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { ShopsModule } from './shops/shops.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { AiModule } from './ai/ai.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const token = configService.get<string>('TELEGRAM_BOT_TOKEN');

        if (!token) {
          throw new Error('TELEGRAM_BOT_TOKEN is not defined in .env');
        }

        return {
          token: token,
        };
      },
      inject: [ConfigService],
    }),

    PrismaModule,
    AiModule,
    TelegramModule,
    CategoriesModule,
    ShopsModule,
    ProductsModule,
    OrdersModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
