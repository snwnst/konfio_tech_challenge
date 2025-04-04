import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { BootstrapModule } from './bootstrap.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(BootstrapModule);

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Konfio Customer API')
    .setDescription('API para la gestión de clientes de Konfio')
    .setVersion('1.0')
    .addTag('customers')
    .addTag('parties')
    .addTag('contact-info')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

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
