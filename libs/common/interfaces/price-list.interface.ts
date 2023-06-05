import { PeriodType } from '.prisma/subscriptions';

export interface PriceList {
  id: string;
  currency: string;
  period: number;
  value: number;
  periodType: PeriodType;
}
