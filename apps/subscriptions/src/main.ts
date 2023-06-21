// import { ConfigService }       from '@nestjs/config';
// import { NestFactory }         from '@nestjs/core';
// import { Transport }           from '@nestjs/microservices';

// import { SubscriptionsModule } from './subscriptions.module';

// async function bootstrap() {
//   const app = await NestFactory.create(SubscriptionsModule, { rawBody: true });
//   const configService = app.get(ConfigService);

//   app.setGlobalPrefix('api');

//   app.connectMicroservice({
//     transport: Transport.TCP,
//     options: {
//       host: '0.0.0.0',
//       port: configService.get<string>('global.subscriptions.tcpPort'),
//     },
//   });

//   await Promise.all([app.startAllMicroservices(), app.listen(6000)]).then(
//     () => {
//       console.log('Subscriptions Microservice is running...');
//     },
//   );
// }
// bootstrap();

import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { SubscriptionsModule } from './subscriptions.module';

class SubscriptionsMicroservice {
  public constructor(private readonly configService: ConfigService) {}

  public async start(): Promise<void> {
    const app = await NestFactory.create(SubscriptionsModule, {
      rawBody: true,
    });

    app.setGlobalPrefix('api');
    await this.configureMicroservice(app);
    await app.listen(
      <string>this.configService.get('global.subscriptions.port'),
    );

    console.log('Subscriptions Microservice is running...');
  }

  private async configureMicroservice(app: INestApplication): Promise<void> {
    const tcpPort = this.configService.get<string>(
      'global.subscriptions.tcpPort',
    );

    app.connectMicroservice({
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: tcpPort,
      },
    });

    await app.startAllMicroservices();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(SubscriptionsModule);
  const configService = app.get(ConfigService);

  const subscriptionsMicroservice = new SubscriptionsMicroservice(
    configService,
  );
  await subscriptionsMicroservice.start();
}

async function main() {
  try {
    await bootstrap();
  } catch (error) {
    console.error('An error occurred during application startup:', error);
    process.exit(1);
  }
}

void main();
