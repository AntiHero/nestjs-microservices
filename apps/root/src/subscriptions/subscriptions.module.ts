import { globalConfig } from '@app/common/config/microservices.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigType } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { SubscriptionsController } from './api/subscriptions.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'SUBSCRIPTIONS',
        useFactory: (config: ConfigType<typeof globalConfig>) => {
          const { host, port } = config.subscriptions;

          return {
            transport: Transport.TCP,
            options: {
              host,
              port,
            },
          };
        },
        inject: [globalConfig.KEY],
      },
    ]),
  ],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
