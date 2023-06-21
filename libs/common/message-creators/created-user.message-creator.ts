import { type User }   from '@prisma/client';

import { AccountPlan } from '../enums';

export interface CreatedUserType
  extends Pick<User, 'email' | 'username' | 'createdAt' | 'id'> {
  accountPlan?: AccountPlan;
  isBanned?: false;
  isDeleted?: false;
  avatar?: null;
  profile?: null;
  isEmailConfirmed?: boolean;
}

export const createdUserMessageCreator = (
  data: CreatedUserType,
): CreatedUserType => ({
  accountPlan: AccountPlan.PERSONAL,
  avatar: null,
  profile: null,
  isBanned: false,
  isDeleted: false,
  isEmailConfirmed: false,
  ...data,
});
