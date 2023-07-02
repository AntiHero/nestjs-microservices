import {
  Payment,
  Subscription,
  SubscriptionPrice,
} from '.prisma/subscriptions';

export type CreatedSubscriptinType = Pick<
  Subscription,
  'userId' | 'type' | 'id'
> &
  Pick<Payment, 'currency' | 'price' | 'provider' | 'status'> &
  Pick<SubscriptionPrice, 'period' | 'periodType'> & {
    endDate: string | null;
    startDate: string | null;
  };

export const createdSubscriptionMessageCreator = (
  data: CreatedSubscriptinType,
): CreatedSubscriptinType => data;
