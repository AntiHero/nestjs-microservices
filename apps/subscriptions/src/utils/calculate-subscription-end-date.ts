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
// import { PeriodType } from '.prisma/subscriptions';

// export const calculateSubscriptionEndDate = (
//   currentDate: Date,
//   period: number,
//   periodType: PeriodType,
// ): Date => {
//   const endDateforDay = new Date(
//     currentDate.setDate(currentDate.getDate() + period),
//   );
//   const endDateforMonth = new Date(
//     currentDate.setMonth(currentDate.getMonth() + period),
//   );
//   const endDateforYear = new Date(
//     currentDate.setFullYear(currentDate.getFullYear() + period),
//   );

//   switch (periodType) {
//     case PeriodType.DAY:
//       return endDateforDay;
//     case PeriodType.MONTH:
//       return endDateforMonth;
//     case PeriodType.YEAR:
//       return endDateforYear;
//     default:
//       return endDateforMonth;
//   }
// };
