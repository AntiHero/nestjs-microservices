import { SubscriptionType } from '.prisma/subscriptions';

import { PeriodType }       from '../enums/period-type.enum';

export interface CurrentSubscriptionDbType {
  id: string;
  endDate: string;
  startDate: string;
  subscriptionPayment: {
    pricingPlan: {
      subscriptionType: SubscriptionType;
    };
  } | null;
}

export interface CurrentSubscriptionViewModelType {
  price: number;
  period: number;
  periodType: PeriodType;
  paymentDate: string;
  endDate: string;
}
