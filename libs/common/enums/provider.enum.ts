import { PaymentProvider as PaymentProviderEnum } from '.prisma/subscriptions';

export const PaymentProvider: typeof PaymentProviderEnum = {
  STRIPE: 'STRIPE',
  PAYPAL: 'PAYPAL',
};

export type PaymentProvider = PaymentProviderEnum;
