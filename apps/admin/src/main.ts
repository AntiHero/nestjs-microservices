import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { RmqService } from '@app/common/src';
import { NestFactory } from '@nestjs/core';

import { AdminModule } from './admin.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // const rmqService = app.get<RmqService>(RmqService);
  // app.connectMicroservice(rmqService.getOptions('admin'));

  await Promise.all([
    app.startAllMicroservices(),
    app.listen(configService.get<string>('global.port') || 7000),
  ]).then(() => 'Admin microserivces is running...');
}
bootstrap();
