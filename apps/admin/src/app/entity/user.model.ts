import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';

import { AccountPlan, OauthProvider } from '@app/common/enums';
import type { User } from '@prisma/client';

export class EmailConfirmationModel extends TimeStamps {
  @prop()
  public confirmation: string;

  @prop({ type: () => Date })
  public expirationDate: Date;

  @prop()
  public confirmationCode: string;

  @prop()
  public isConfirmed: boolean;

  @prop({ unique: true })
  public userEmail: string;
}

export class AvatarModel extends TimeStamps {
  @prop()
  public id: string;

  @prop()
  public url: string | null;

  @prop({ type: () => String, default: null })
  public previewUrl: string | null;

  @prop({ type: () => Number, default: null })
  public size: number | null;

  @prop({ type: () => Number, default: null })
  public height: number | null;

  @prop({ type: () => Number, default: null })
  public width: number | null;

  @prop()
  public userId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OauthAccountModel extends Base {}
export class OauthAccountModel {
  @prop()
  public id: string;

  @prop()
  public clientId: string;

  @prop({ enum: OauthProvider, type: () => String })
  public type: OauthProvider;

  @prop()
  public linked: boolean;

  @prop({ type: () => String, default: null })
  public mergeCode: string | null;

  @prop({ type: () => Date, default: null })
  public mergeCodeExpDate: Date | null;

  @prop()
  public userId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProfileModel extends Base {}
export class ProfileModel extends TimeStamps {
  @prop()
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

export class PasswordRecoveryModel {
  @prop({ type: () => String, default: null })
  public recoveryCode: string | null;

  @prop({ type: () => String, default: null })
  public expirationDate: string | null;

  @prop()
  public userId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserModel extends Base {}
export class UserModel
  extends TimeStamps
  implements Record<Exclude<keyof User, 'createdAt' | 'updatedAt'>, any>
{
  @prop({ unique: true })
  public id: string;

  @prop()
  public username: string;

  @prop({ unique: true })
  public email: string;

  @prop({ type: String, default: null })
  public hash: string | null;

  @prop({ enum: AccountPlan, type: () => String })
  public accountPlan: AccountPlan;

  @prop({ type: () => EmailConfirmationModel })
  public emailConfirmation: EmailConfirmationModel;

  @prop({ type: () => AvatarModel })
  public avatar: AvatarModel;

  @prop({ type: () => [OauthAccountModel] })
  public ouathAccount: OauthAccountModel[];

  @prop({ type: () => ProfileModel })
  public profile: ProfileModel;

  @prop({ type: () => PasswordRecoveryModel })
  public passwordRecovery: PasswordRecoveryModel;

  @prop()
  public isDeleted: boolean;

  @prop()
  public isBanned: boolean;
}
