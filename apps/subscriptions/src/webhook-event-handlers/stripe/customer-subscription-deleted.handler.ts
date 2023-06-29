import { SubscriptionStatus }            from '.prisma/subscriptions';
import {
  StripeEvent,
  StripeSubscriptionObject,
} from '@app/common/interfaces/events.interface';
import { Injectable }                    from '@nestjs/common';
import { InjectStripe }                  from 'nestjs-stripe';

import { PrismaService }                 from 'apps/subscriptions/src/prisma/prisma.service';
import { SubscriptionsQueryRepository }  from 'apps/subscriptions/src/repositories/subscriptions.query-repository';
import { SubscriptionsRepository }       from 'apps/subscriptions/src/repositories/subscriptions.repository';

import { CUSTOMER_SUBSCRIPTION_DELETED } from '../../constants';
import { Handler }                       from '../abstract.handler';

@Injectable()
export class CustomerSubscriptionDeletedEventHandler extends Handler {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly subscriptionsTransactionService: SubscriptionsRepository,
    @InjectStripe()
    private readonly subscriptionsQueryRepository: SubscriptionsQueryRepository,
  ) {
    super();
  }

  protected async doHandle(
    event: StripeEvent<StripeSubscriptionObject>,
  ): Promise<boolean> {
    if (event.type === CUSTOMER_SUBSCRIPTION_DELETED) {
      const { id: relatedSubscription } = event.data.object;

      const subscription =
        await this.subscriptionsQueryRepository.getSubscriptionByQuery({
          status: SubscriptionStatus.ACTIVE,
          relatedSubscription,
        });

      if (subscription) {
        await this.subscriptionsTransactionService.cancelSubscription(
          this.prismaService,
          subscription.id,
        );
      }

      return false;
    }

    return true;
  }
}
