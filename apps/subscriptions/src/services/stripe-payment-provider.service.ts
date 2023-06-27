import { PaymentProvider }                        from '.prisma/subscriptions';
import { InternalServerErrorException, Provider } from '@nestjs/common';
import { InjectStripe }                           from 'nestjs-stripe';
import Stripe                                     from 'stripe';

import { PaymentProviderService }                 from './payment-provider.service';

export class StripePaymentService extends PaymentProviderService {
  public constructor(@InjectStripe() private readonly stripe: Stripe) {
    super();
  }

  public provider = PaymentProvider.STRIPE;

  public async cancelSubscription(id: string, reason?: string): Promise<void> {
    await this.stripe.subscriptions
      .del(id, {
        cancellation_details: {
          comment: !reason ? 'Cancel subscription' : reason,
        },
      })
      .then(console.log)
      .catch((e) => new InternalServerErrorException(e));
  }

  public async createCustomerIfNotExists(email: string, username: string) {
    const customer =
      (
        await this.stripe.customers.list({
          email,
        })
      ).data[0] ||
      (await this.stripe.customers.create({
        name: username,
        email,
      }));

    return customer;
  }
}
