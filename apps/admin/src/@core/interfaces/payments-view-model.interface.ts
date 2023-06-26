import type {
  Currency,
  PaymentProvider,
  SubscriptionType,
} from '@app/common/enums';

export interface PaymentViewModel {
  type: SubscriptionType;
  startDate: Date;
  endDate: Date;
  currency: Currency;
  price: number;
  paymentType: PaymentProvider;
}
