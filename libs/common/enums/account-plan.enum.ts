import { AccountPlan as AccountPlanEnum } from '@prisma/client';

export const AccountPlan: typeof AccountPlanEnum = {
  BUSINESS: 'BUSINESS',
  PERSONAL: 'PERSONAL',
};

export type AccountPlan = AccountPlanEnum;
