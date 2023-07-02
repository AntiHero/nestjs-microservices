import { globalConfig }                             from '@app/common/config/global.config';
import { Queue }                                    from '@app/common/queues';
import { RmqModule }                                from '@app/common/src/rmq/rmq.module';
import { ClientToken, RmqClientToken }              from '@app/common/tokens';
import { DynamicModule, Module }                    from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType }  from '@nestjs/config';
import { CqrsModule }                               from '@nestjs/cqrs';
import { EventEmitterModule }                       from '@nestjs/event-emitter';
import { ClientsModule, Transport }                 from '@nestjs/microservices';
import { PaypalModule }                             from 'nestjs-paypal';
import { StripeModule }                             from 'nestjs-stripe';

import { SubscriptionsController }                  from 'apps/subscriptions/src/api/subscriptions.controller';

import { AdminRmqClient }                           from './clients/admn-rmq-client';
import { RootRmqClient }                            from './clients/root-rmq.client';
import { PaypalConfigService, paypalConfig }        from './config/paypal.config';
import { stripeConfig }                             from './config/stripe.config';
import { subscriptionsConfig }                      from './config/subscriptions.config';
import { StripePaymentStrategy }                    from './payment-strategies/stripe.strategy';
import { PrismaModule }                             from './prisma/prisma.module';
import { PaymentServicesProvider }                  from './providers/payment-services.provider';
import { PaymentStrategiesProvider }                from './providers/payment-strategies.provider';
import {
  WebhookEventHandlersProvider,
  webhookEventHandlers,
} from './providers/webhook-event-handlers.provider';
import { OutboxRepositoryProvider }                 from './repositories/outbox/outbox.repository';
import { SubscriptionsQueryRepository }             from './repositories/subscriptions.query-repository';
import { SubscriptionsRepository }                  from './repositories/subscriptions.repository';
import { EventRouter }                              from './services/event-router';
import { OutboxWorkerService }                      from './services/outbox-worker.service';
import { RootServiceProvider }                      from './services/root.service';
import { StripePaymentService }                     from './services/stripe-payment-provider.service';
import { CancelSubscriptionCommandHandler }         from './use-cases/cancel-subscription.use-case';
import { CreateCustomerIfNotExistsCommandHandler }  from './use-cases/create-customer-if-not-exists.use-case';
import { CreatePaymentsCommandHandler }             from './use-cases/create-payments.use-case';
import { ProcessCheckoutTransactionCommandHandler } from './use-cases/process-checkout-transaction.use-case';
import { ProcessPaymentCommandHanlder }             from './use-cases/process-payment.use-case';

const commandHandlers = [
  ProcessCheckoutTransactionCommandHandler,
  ProcessPaymentCommandHanlder,
  CreatePaymentsCommandHandler,
  CancelSubscriptionCommandHandler,
  CreateCustomerIfNotExistsCommandHandler,
];

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    EventEmitterModule.forRoot(),
    SubscriptionsModule.setupStripeModule(),
    SubscriptionsModule.setupPaypalModule(),
    SubscriptionsModule.setupClientsModule(),
    SubscriptionsModule.setupConfigModule(),
    ...SubscriptionsModule.setupRmqClients(),
  ],
  controllers: [SubscriptionsController],
  providers: [
    EventRouter,
    ...commandHandlers,
    ...webhookEventHandlers,
    StripePaymentService,
    StripePaymentStrategy,
    PaymentServicesProvider,
    PaymentStrategiesProvider,
    WebhookEventHandlersProvider,
    SubscriptionsQueryRepository,
    OutboxRepositoryProvider,
    SubscriptionsRepository,
    RootRmqClient,
    AdminRmqClient,
    RootServiceProvider,
    OutboxWorkerService,
  ],
})
export class SubscriptionsModule {
  public static setupRmqClients(): DynamicModule[] {
    return [
      RmqModule.register({
        name: RmqClientToken.ROOT_RMQ,
        queue: Queue.Root,
      }),
      RmqModule.register({
        name: RmqClientToken.ADMIN_RMQ,
        queue: Queue.Admin,
      }),
    ];
  }

  public static setupClientsModule(): DynamicModule {
    return ClientsModule.registerAsync([
      {
        name: ClientToken.ROOT,
        useFactory: (config: ConfigType<typeof globalConfig>) => {
          const { host, tcpPort: port } = config.root;

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
    ]);
  }

  public static setupConfigModule(): DynamicModule {
    return ConfigModule.forRoot({
      isGlobal: true,
      load: [paypalConfig, stripeConfig, subscriptionsConfig, globalConfig],
    });
  }

  public static setupPaypalModule(): DynamicModule {
    return PaypalModule.forRootAsync({
      useFactory: (configService: PaypalConfigService) => ({
        clientID: configService.get('paypal.clientID', { infer: true }),
        secret: configService.get('paypal.secret', { infer: true }),
        live: true,
      }),
      inject: [ConfigService],
    });
  }

  public static setupStripeModule(): DynamicModule {
    return StripeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        apiKey: <string>configService.get('stripe.apiKey'),
        apiVersion: '2022-11-15',
      }),
      inject: [ConfigService],
    });
  }
}
