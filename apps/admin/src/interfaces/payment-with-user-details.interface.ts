import { Currency, PaymentProvider, SubscriptionType } from '@app/common/enums';

export interface PaymentWithUserDetails {
  id: string;
  currency: Currency;
  price: number;
  provider: PaymentProvider;
  type: SubscriptionType;
  createdAt: Date;
  username: string;
  photo: string;
}
