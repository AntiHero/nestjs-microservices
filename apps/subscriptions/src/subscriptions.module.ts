import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import {
  webhookEventHandlers,
  WebhookEventHandlersProvider,
} from './providers/webhook-event-handlers.provider';
import { STRIPE_PAYMENT_SERVICE } from './constants';
import { stripeConfig } from './config/stripe.config';
import { PrismaModule } from './prisma/prisma.module';
import { RootService } from './services/root.service';
import { subscriptionsConfig } from './config/subscriptions.config';
import { RootServiceAdapter } from './services/root.service-adapter';
import { globalConfig } from '@app/common/config/microservices.config';
import { StripePaymentStrategy } from './payment-strategies/stripe.strategy';
import { PaymentServicesProvider } from './providers/payment-services.provider';
import { StartPaymentCommandHandler } from './use-cases/start-payment.use-case';
import { StripePaymentService } from './services/stripe-payment-provider.service';
import { PaymentStrategiesProvider } from './providers/payment-strategies.provider';
import { ProcessPaymentCommandHanlder } from './use-cases/process-payment.use-case';
import { CreatePaymentsCommandHandler } from './use-cases/create-payments.use-case';
import { SubscriptionsController } from 'apps/subscriptions/src/subscriptions.controller';
import { CancelSubscriptionCommandHandler } from './use-cases/cancel-subscription.use-case';
import { SubscriptionsQueryRepository } from './repositories/subscriptions.query-repository';
import { SubscriptionsTransactionService } from './services/subscriptions-transaction.service';
import { PaymentSystemModule } from 'apps/subscriptions/src/payment-system/payment-system.module';
import { ValidatePaymentInputCommandHandler } from './use-cases/validate-payment-input.use-case';
import { CreateCustomerIfNotExistsCommandHandler } from './use-cases/create-customer-if-not-exists.use-case';
import { ProcessActiveSubscriptionPaymentCommandHandler } from './use-cases/process-active-subscription-payment.use-case';
import { ProcessPendingSubscriptionPaymentCommandHandler } from './use-cases/process-pending-subscription-payment.use-case';

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
    {
      provide: STRIPE_PAYMENT_SERVICE,
      useClass: StripePaymentService,
    },
    {
      provide: RootServiceAdapter,
      useClass: RootService,
    },
  ],
})
export class SubscriptionsModule {}
