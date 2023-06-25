import { globalConfig }                from '@app/common/config/global.config';
import { Module }                      from '@nestjs/common';
import { ConfigType }                  from '@nestjs/config';
import { ClientsModule, Transport }    from '@nestjs/microservices';

import { SubscriptionsController }     from './api/subscriptions.controller';
import { SubscriptionsService }        from './services/subscriptions.service';
import { SubscriptionsServiceAdapter } from './services/subscriptions.service-adapter';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'SUBSCRIPTIONS',
        useFactory: (config: ConfigType<typeof globalConfig>) => {
          const { host, tcpPort: port } = config.subscriptions;

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
  providers: [
    {
      provide: SubscriptionsServiceAdapter,
      useClass: SubscriptionsService,
    },
  ],
})
export class SubscriptionsModule {}
