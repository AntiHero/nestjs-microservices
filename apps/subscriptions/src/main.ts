import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';

import { SubscriptionsModule } from './subscriptions.module';
import { ConfigService } from '@nestjs/config';

console.log(process.env.SUBSCRIPTIONS_HOST, 'service host');
async function bootstrap() {
  const app = await NestFactory.create(SubscriptionsModule);
  const configService = app.get(ConfigService);

  console.log(configService.get<string>('global.subscriptions.port'));

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      // host:
      //   process.env.MODE === 'production'
      //     ? process.env.SUBSCRIPTIONS_HOST
      //     : 'localhost',
      host: '0.0.0.0',
      port: configService.get<string>('global.subscriptions.port'),
      // process.env.MODE === 'production'
      //   ? parseInt(<string>process.env.SUBSCRIPTIONS_PORT)
      //   : 5001,
    },
  });
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   SubscriptionsModule,
  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       // host:
  //       //   process.env.MODE === 'production'
  //       //     ? process.env.SUBSCRIPTIONS_HOST
  //       //     : 'localhost',
  //       port:
  //         process.env.MODE === 'production'
  //           ? parseInt(<string>process.env.SUBSCRIPTIONS_PORT)
  //           : 5001,
  //     },
  //   },
  // );

  await app.startAllMicroservices().then(() => {
    console.log('Subscriptions Microservice is running...');
  });
  // await app
  //   .listen()
  //   .then();
}
bootstrap();
