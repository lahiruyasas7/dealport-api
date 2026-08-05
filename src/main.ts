import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not in the DTO
      forbidNonWhitelisted: true, // rejects requests with extra properties
      transform: true, // enables @Type() and auto-transforms payloads
    }),
  );
  await app.listen(3003);
}
bootstrap();
