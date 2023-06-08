import { Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';

import { SubscriptionsModule } from './subscriptions.module';
import { ConfigService } from '@nestjs/config';
// import { RmqService } from '@app/common/src';

async function bootstrap() {
  const app = await NestFactory.create(SubscriptionsModule);
  const configService = app.get(ConfigService);

  // const rmq = app.get(RmqService);

  // app.connectMicroservice(rmq.getOptions('main'));

  app.setGlobalPrefix('api');

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get<string>('global.subscriptions.tcpPort'),
    },
  });

  await Promise.all([app.startAllMicroservices(), app.listen(6000)]).then(
    () => {
      console.log('Subscriptions Microservice is running...');
    },
  );
}
bootstrap();
