import { PaymentProvider } from '.prisma/subscriptions';

export interface GetCheckoutSessionUrlPayload {
  priceId: string;
  paymentSystem: PaymentProvider;
  userId: string;
}
