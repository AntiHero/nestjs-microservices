import { AccountPlan } from '../enums';

export interface UpdatedUserAccountPlanType {
  userId: string;
  plan: AccountPlan;
}

export const updateUserAccountPlanMessageCreator = (
  data: UpdatedUserAccountPlanType,
) => data;
