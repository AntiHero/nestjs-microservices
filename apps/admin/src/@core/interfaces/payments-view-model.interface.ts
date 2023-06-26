import type {
  Currency,
  PaymentProvider,
  SubscriptionType,
} from '@app/common/enums';

export interface UserPaymentViewModel {
  subscriptionType: SubscriptionType;
  startDate: Date;
  endDate: Date;
  currency: Currency;
  price: number;
  paymentType: PaymentProvider;
}
