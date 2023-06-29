import { INestApplication }    from '@nestjs/common';
import { ConfigService }       from '@nestjs/config';
import { NestFactory }         from '@nestjs/core';
import { Transport }           from '@nestjs/microservices';

import { SubscriptionsModule } from './subscriptions.module';

class SubscriptionsMicroservice {
  public constructor(private readonly configService: ConfigService) {}

  public async start(): Promise<void> {
    const app = await NestFactory.create(SubscriptionsModule, {
      rawBody: true,
    });

    app.setGlobalPrefix('api');
    await this.configureMicroservice(app);

    const port = <string>this.configService.get('global.subscriptions.port');
    await app.listen(port);

    console.log('Subscriptions Microservice is running at port %s...', port);
  }

  private async configureMicroservice(app: INestApplication): Promise<void> {
    const port = this.configService.get<string>('global.subscriptions.tcpPort');

    app.connectMicroservice({
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port,
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
