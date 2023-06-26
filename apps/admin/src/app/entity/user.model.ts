import { AccountPlan }            from '@app/common/enums';
import type { User }              from '@prisma/client';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { TimeStamps }             from '@typegoose/typegoose/lib/defaultClasses';

export class AvatarClass extends TimeStamps {
  @prop({ type: () => String, default: null })
  public url: string | null;

  @prop({ type: () => String, default: null })
  public previewUrl: string | null;
}

export class ProfileClass extends TimeStamps {
  @prop({ type: () => String, default: null })
  public name: string | null;

  @prop({ type: () => String, default: null })
  public surname: string | null;

  @prop({ type: () => String, default: null })
  public birthday: Date | null;

  @prop({ type: () => String, default: null })
  public city: string | null;

  @prop({ type: () => String, default: null })
  public aboutMe: string | null;
}

export class UserClass
  extends TimeStamps
  implements
    Record<Exclude<keyof User, 'createdAt' | 'updatedAt' | 'hash'>, any>
{
  @prop({ unique: true })
  public id: string;

  @prop()
  public username: string;

  @prop({ unique: true })
  public email: string;

  @prop({ enum: AccountPlan, type: () => String })
  public accountPlan: AccountPlan;

  @prop({ type: () => AvatarClass, default: null })
  public avatar: AvatarClass | null;

  @prop({ type: () => ProfileClass, default: null })
  public profile: ProfileClass | null;

  @prop({ default: false })
  public isBanned: boolean;

  @prop({ default: false })
  public isEmailConfirmed: boolean;

  @prop({ default: 'Another reason' })
  public banReason: string;
}

export const UserModel = getModelForClass(UserClass, {
  options: {
    customName: 'users',
  },
});
