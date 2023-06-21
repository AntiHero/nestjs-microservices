import { globalConfig } from '@app/common/config/global.config';
import { Queue } from '@app/common/queues';
import { RmqModule } from '@app/common/src/rmq/rmq.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { PaymentSystemModule } from 'apps/subscriptions/src/payment-system/payment-system.module';
import { SubscriptionsController } from 'apps/subscriptions/src/subscriptions.controller';

import { AdminRmqClient } from './clients/admn-rmq-client';
import { RootRmqClient } from './clients/root-rmq.client';
import { stripeConfig } from './config/stripe.config';
import { subscriptionsConfig } from './config/subscriptions.config';
import { StripePaymentStrategy } from './payment-strategies/stripe.strategy';
import { PrismaModule } from './prisma/prisma.module';
import { PaymentServicesProvider } from './providers/payment-services.provider';
import { PaymentStrategiesProvider } from './providers/payment-strategies.provider';
import {
  WebhookEventHandlersProvider,
  webhookEventHandlers,
} from './providers/webhook-event-handlers.provider';
import { SubscriptionsQueryRepository } from './repositories/subscriptions.query-repository';
import { EventRouter } from './services/event-router';
import { RootServiceProvider } from './services/root.service';
import {
  StripePaymentService,
  StripePaymentServiceProvider,
} from './services/stripe-payment-provider.service';
import { SubscriptionsTransactionService } from './services/subscriptions-transaction.service';
import { CancelSubscriptionCommandHandler } from './use-cases/cancel-subscription.use-case';
import { CreateCustomerIfNotExistsCommandHandler } from './use-cases/create-customer-if-not-exists.use-case';
import { CreatePaymentsCommandHandler } from './use-cases/create-payments.use-case';
import { ProcessActiveSubscriptionPaymentCommandHandler } from './use-cases/process-active-subscription-payment.use-case';
import { ProcessPaymentCommandHanlder } from './use-cases/process-payment.use-case';
import { ProcessPendingSubscriptionPaymentCommandHandler } from './use-cases/process-pending-subscription-payment.use-case';
import { StartPaymentCommandHandler } from './use-cases/start-payment.use-case';
import { ValidatePaymentInputCommandHandler } from './use-cases/validate-payment-input.use-case';

const commandHandlers = [
  StartPaymentCommandHandler,
  ProcessPaymentCommandHanlder,
  CreatePaymentsCommandHandler,
  CancelSubscriptionCommandHandler,
  ValidatePaymentInputCommandHandler,
  CreateCustomerIfNotExistsCommandHandler,
  ProcessPendingSubscriptionPaymentCommandHandler,
  ProcessActiveSubscriptionPaymentCommandHandler,
];

@Module({
  imports: [
    CqrsModule,
    PaymentSystemModule.setupStripeAsync({
      useFactory: (configService: ConfigService) => ({
        apiKey: <string>configService.get('stripe.apiKey'),
        apiVersion: '2022-11-15',
      }),
      inject: [ConfigService],
    }),
    PaymentSystemModule.setupPaypalAsync({
      useFactory: (configService: ConfigService) => ({
        clientId: <string>configService.get('paypal.clientId'),
        clientSecret: <string>configService.get('paypal.clientSecret'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [stripeConfig, subscriptionsConfig, globalConfig],
    }),
    PrismaModule,
    RmqModule.register({
      name: 'ROOT_RMQ',
      queue: Queue.Root,
    }),
    RmqModule.register({
      name: 'ADMIN_RMQ',
      queue: Queue.Admin,
    }),
    ClientsModule.registerAsync([
      {
        name: 'ROOT',
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
    ]),
  ],
  controllers: [SubscriptionsController],
  providers: [
    ...commandHandlers,
    ...webhookEventHandlers,
    StripePaymentService,
    StripePaymentStrategy,
    PaymentServicesProvider,
    PaymentStrategiesProvider,
    WebhookEventHandlersProvider,
    SubscriptionsQueryRepository,
    SubscriptionsTransactionService,
    EventEmitter,
    RootRmqClient,
    AdminRmqClient,
    EventRouter,
    StripePaymentServiceProvider,
    RootServiceProvider,
  ],
})
export class SubscriptionsModule {}
