import { SubscriptionType as SubscriptionTypeEnum } from '.prisma/subscriptions';

export const SubscriptionType: typeof SubscriptionTypeEnum = {
  ONETIME: 'ONETIME',
  RECCURING: 'RECCURING',
};

export type SubscriptionType = SubscriptionTypeEnum;
