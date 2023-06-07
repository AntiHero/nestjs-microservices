import { Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';

import { SubscriptionsModule } from './subscriptions.module';
import { ConfigService } from '@nestjs/config';

console.log(process.env.SUBSCRIPTIONS_HOST, 'service host');
async function bootstrap() {
  const app = await NestFactory.create(SubscriptionsModule);
  const configService = app.get(ConfigService);

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
