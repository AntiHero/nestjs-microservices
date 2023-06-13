import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AdminModule } from './admin.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(7000);
}
bootstrap();
