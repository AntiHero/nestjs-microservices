import { type User }                             from '@prisma/client';
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { AccountPlan }                           from '../enums';

export interface CreatedUserType
  extends Pick<User, 'email' | 'username' | 'id' | 'createdAt'> {
  accountPlan?: AccountPlan;
  isBanned?: boolean;
  avatar?: null;
  profile?: null;
  isEmailConfirmed?: boolean;
}

export class CreatedUserType {
  @IsNotEmpty()
  public id: string;

  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsDate()
  @IsNotEmpty()
  public createdAt: Date;
}

export const createdUserMessageCreator = (
  data: CreatedUserType,
): CreatedUserType => ({
  accountPlan: AccountPlan.PERSONAL,
  avatar: null,
  profile: null,
  isBanned: false,
  isEmailConfirmed: false,
  ...data,
});
