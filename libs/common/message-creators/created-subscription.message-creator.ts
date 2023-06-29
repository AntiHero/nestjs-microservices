import {
  Payment,
  Subscription,
  SubscriptionPrice,
} from '.prisma/subscriptions';

export type CreatedSubscriptinType = Pick<
  Subscription,
  'userId' | 'endDate' | 'startDate' | 'type' | 'id'
> &
  Pick<Payment, 'currency' | 'price' | 'provider' | 'status'> &
  Pick<SubscriptionPrice, 'period' | 'periodType'>;

export const createdSubscriptionMessageCreator = (
  data: CreatedSubscriptinType,
): CreatedSubscriptinType => data;
