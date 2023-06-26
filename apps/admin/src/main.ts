import { HttpExceptionFilter } from '@app/common/filters/http-exception.filter';
import { Queue }               from '@app/common/queues';
import { RmqService }          from '@app/common/src';
import { ValidationPipe }      from '@nestjs/common';
import { ConfigService }       from '@nestjs/config';
import { NestFactory }         from '@nestjs/core';

import { AdminModule }         from './admin.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const rmqService = app.get<RmqService>(RmqService);
  // find connection options by queue name
  app.connectMicroservice(rmqService.getOptions(Queue.Admin));

  const port = configService.get<string>('global.port') || 7000;

  await Promise.all([app.startAllMicroservices(), app.listen(port)]).then(() =>
    console.log('Admin microserivces is running at port %s...', port),
  );
}
bootstrap();
