import { NestFactory } from '@nestjs/core';
import { BootstrapModule } from './bootstrap.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(BootstrapModule);

  const config = new DocumentBuilder()
    .setTitle('Konfio Customer API')
    .setDescription('API for managing Konfio customers')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
