import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para permitir requisições de qualquer origem
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  // Adicionar logs detalhados
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  Logger.log(` Application is running on: http://localhost:${port}`);
  Logger.log(` API Documentation: http://localhost:${port}/users`);
  Logger.log(` API Documentation: http://localhost:${port}/posts`);
}
bootstrap();
