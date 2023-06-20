import { Subscription, Payment } from '.prisma/subscriptions';

type CreatedSubscriptinType = Pick<
  Subscription,
  'userId' | 'endDate' | 'startDate' | 'type'
> &
  Pick<Payment, 'currency' | 'price' | 'provider' | 'status'>;

export const createdSubscriptionMessageCreator = (
  data: CreatedSubscriptinType,
): CreatedSubscriptinType => data;
