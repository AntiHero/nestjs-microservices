import { Currency }            from '@app/common/enums';
import { PeriodType }          from '@app/common/enums/period-type.enum';
import { CurrentSubscription } from '@app/common/interfaces/current-subscription.interface';

import { formatDate }          from './format-date';

export interface CurrentSubscriptionViewModel {
  startDate: string;
  endDate: string;
  currency: Currency;
  period: number;
  periodType: PeriodType;
  amount: number;
}

export class SubscriptionMapper {
  public static toViewModel(
    subscription: CurrentSubscription,
  ): CurrentSubscriptionViewModel {
    const {
      startDate,
      endDate,
      subscriptionPayment: {
        pricingPlan: {
          price: { currency, period, periodType, value: amount },
        },
      },
    } = subscription;

    return {
      currency,
      period,
      periodType,
      amount,
      startDate: formatDate(<Date>startDate),
      endDate: formatDate(<Date>endDate),
    };
  }
}
