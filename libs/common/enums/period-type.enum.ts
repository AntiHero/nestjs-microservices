import { PeriodType as PeriodTypeEnum } from '.prisma/subscriptions';

export const PeriodType: typeof PeriodTypeEnum = {
  DAY: 'DAY',
  MONTH: 'MONTH',
  YEAR: 'YEAR',
};

export type PeriodType = PeriodTypeEnum;
