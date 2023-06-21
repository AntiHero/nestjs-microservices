import { Queue }          from '@app/common/queues';
import { RmqService }     from '@app/common/src';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService }  from '@nestjs/config';
import { NestFactory }    from '@nestjs/core';

import { AdminModule }    from './admin.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const rmqService = app.get<RmqService>(RmqService);
  // find connection options by queue name
  app.connectMicroservice(rmqService.getOptions(Queue.Admin));

  await Promise.all([
    app.startAllMicroservices(),
    app.listen(configService.get<string>('global.port') || 7000),
  ]).then(() => 'Admin microserivces is running...');
}
bootstrap();
