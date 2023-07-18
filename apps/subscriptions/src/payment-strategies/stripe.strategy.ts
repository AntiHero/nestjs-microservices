import { PaymentProvider }                  from '.prisma/subscriptions';
import { Inject, Injectable }               from '@nestjs/common';
import { ConfigType }                       from '@nestjs/config';
import { CommandBus }                       from '@nestjs/cqrs';
import { InjectStripe }                     from 'nestjs-stripe';
import Stripe                               from 'stripe';

import { subscriptionsConfig }              from 'apps/subscriptions/src/config/subscriptions.config';

import { PaymentCommand, PaymentStrategy }  from './abstract.strategy';
import { CreateCustomerIfNotExistsCommand } from '../use-cases/create-customer-if-not-exists.use-case';
import {}                                   from '../use-cases/create-payments.use-case';

@Injectable()
export class StripePaymentStrategy extends PaymentStrategy<string | null> {
  public constructor(
    @InjectStripe() private readonly stripe: Stripe,
    @Inject(subscriptionsConfig.KEY)
    private config: ConfigType<typeof subscriptionsConfig>,
    private readonly commandBus: CommandBus,
  ) {
    super();
  }

  public provider = PaymentProvider.STRIPE;

  public async execute(command: PaymentCommand): Promise<string | null> {
    const {
      data: {
        userId,
        providerPriceId,
        paymentId,
        period,
        periodType,
        subscriptionId,
      },
    } = command;

    const customer = await this.commandBus.execute<
      CreateCustomerIfNotExistsCommand,
      Stripe.Customer
    >(new CreateCustomerIfNotExistsCommand(userId, this.provider));

    const checkoutSession: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price: providerPriceId,
          quantity: 1,
        },
      ],
      metadata: {
        subscriptionId,
        paymentId,
        period,
        periodType,
      },
      payment_intent_data: {
        setup_future_usage: 'off_session',
      },
      payment_method_types: ['card'],
      customer: customer.id,
      expires_at: Math.floor((Date.now() + 1_800_000) / 1000),
      mode: 'payment',
      success_url: this.config.successUrl,
      cancel_url: this.config.cancelUrl,
    };

    const session = await this.stripe.checkout.sessions.create(checkoutSession);

    return session.url;
  }
}
