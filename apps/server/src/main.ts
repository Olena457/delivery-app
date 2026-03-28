import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigins = process.env.CORS_ORIGIN?.split(',').map((s) =>
    s.trim(),
  ) ?? ['http://localhost:5173', 'http://127.0.0.1:5173'];

  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);

  console.log(`Server running: http://localhost:${port}`);
  console.log(`Swagger: http://localhost:${port}/api-docs`);
}

bootstrap().catch((err: unknown) => {
  console.error('Error during application bootstrap', err);
  process.exit(1);
});
