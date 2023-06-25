import { AccountPlan } from '@app/common/enums';
import type { User }   from '@prisma/client';
import { prop }        from '@typegoose/typegoose';
import { TimeStamps }  from '@typegoose/typegoose/lib/defaultClasses';

export class AvatarModel extends TimeStamps {
  @prop({ unique: true })
  public id: string;

  @prop({ type: () => String, default: null })
  public url: string | null;

  @prop({ type: () => String, default: null })
  public previewUrl: string | null;
}

export class ProfileModel extends TimeStamps {
  @prop({ unique: true })
  public id: string;

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

  @prop()
  public userId: string;
}

export class UserModel
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

  @prop({ type: () => AvatarModel, default: null })
  public avatar: AvatarModel | null;

  @prop({ type: () => ProfileModel, defaultt: null })
  public profile: ProfileModel | null;

  @prop()
  public isDeleted: boolean;

  @prop()
  public isBanned: boolean;

  @prop()
  public isEmailConfirmed: boolean;
}
