import { SubscriptionType } from '../enums';
import { PeriodType }       from '../enums/period-type.enum';

export interface CurrentSubscription {
  id: string;
  endDate: Date | null;
  startDate: Date;
  subscriptionPayment: {
    pricingPlan: {
      subscriptionType: SubscriptionType;
      price: {
        currency: 'USD';
        period: number;
        value: number;
        periodType: PeriodType;
      };
    };
  };
}
