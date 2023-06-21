import { Currency as CurrencyEnum } from '.prisma/subscriptions';

export const Currency: typeof CurrencyEnum = {
  USD: 'USD',
};

export type Currency = CurrencyEnum;
