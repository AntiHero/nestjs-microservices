import { PeriodType }                  from '.prisma/subscriptions';

import { Payments, PaymentsViewModel } from '../interfaces/payments.interface';

export class PaymentsMapper {
  public static toViewModel(model: [number, Payments[]]): PaymentsViewModel {
    const [count, payments] = model;

    return {
      count,
      payments: payments.map((payment) => {
        const { id, price, provider, subscriptionPayment } = payment;
        const { pricingPlan, subscription } = subscriptionPayment!;

        return {
          id,
          price,
          provider,
          period: pricingPlan?.price.period || 0,
          periodType: pricingPlan?.price.periodType || PeriodType.MONTH,
          paymentDate: subscription!.startDate as unknown as string,
          endDate: (subscription?.endDate as unknown as string) || null,
        };
      }),
    };
  }
}
