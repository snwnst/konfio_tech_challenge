import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { BootstrapModule } from './bootstrap.module';

async function bootstrap() {
  const app = await NestFactory.create(BootstrapModule);

  // Configurar la validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTOs
      transform: true, // Transforma los datos según los tipos definidos
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no definidas
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
