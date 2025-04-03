import { NestFactory } from '@nestjs/core';
import { BootstrapModule } from './bootstrap.module';

async function bootstrap() {
  const app = await NestFactory.create(BootstrapModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
