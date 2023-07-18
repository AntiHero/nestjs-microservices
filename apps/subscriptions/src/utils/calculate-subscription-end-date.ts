import { PeriodType } from '.prisma/subscriptions';

export const determineSubscriptionEndDate = (
  currentDate: Date,
  period: number,
  periodType: PeriodType,
): Date =>
  new Date(
    periodType === PeriodType.DAY
      ? currentDate.setDate(currentDate.getDate() + period)
      : periodType === PeriodType.MONTH
      ? currentDate.setMonth(currentDate.getMonth() + period)
      : currentDate.setFullYear(currentDate.getFullYear() + period),
  );
