import { Payment, Subscription } from '.prisma/subscriptions';

type CreatedSubscriptinType = Pick<
  Subscription,
  'userId' | 'endDate' | 'startDate' | 'type' | 'id'
> &
  Pick<Payment, 'currency' | 'price' | 'provider' | 'status'>;

export const createdSubscriptionMessageCreator = (
  data: CreatedSubscriptinType,
): CreatedSubscriptinType => data;
