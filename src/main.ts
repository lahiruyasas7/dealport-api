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

  //cors configuration
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman / non-browser

      const frontendUrl = process.env.FRONTEND_URL;
      const allowedOrigins = [frontendUrl];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for origin: ${origin}`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('api/v1');
  await app.listen(3003);
}
bootstrap();
