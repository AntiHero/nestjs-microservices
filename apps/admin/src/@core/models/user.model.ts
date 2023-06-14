import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { AccountPlan, OauthProvider } from '@prisma/client';
import { prop } from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface User extends Base {}
export class User extends TimeStamps {
  @prop({ unique: true })
  public id: string;

  @prop()
  public username: string;

  @prop({ unique: true })
  public email: string;

  @prop()
  public hash: string | null;

  @prop({ enum: AccountPlan, type: () => String })
  public accountPlan: AccountPlan;

  @prop({ type: () => EmailConfirmation })
  public emailConfirmation: EmailConfirmation;

  @prop({ type: () => Avatar })
  public avatar: Avatar;

  @prop({ type: () => [OauthAccount] })
  public ouathAccount: OauthAccount[];

  @prop({ type: () => Profile })
  public profile: Profile;

  @prop({ type: () => PasswordRecovery })
  public passwordRecovery: PasswordRecovery;
}

export class EmailConfirmation extends TimeStamps {
  @prop()
  public confirmation: string;

  @prop()
  public exprationDate: Date;

  @prop()
  public confirmationCode: string;

  @prop()
  public isConfirmed: boolean;

  @prop({ unique: true })
  public userEmail: string;
}

export class Avatar extends TimeStamps {
  @prop()
  public id: string;

  @prop()
  public url: string | null;

  @prop()
  public previewUrl: string | null;

  @prop()
  public size: number | null;

  @prop()
  public height: number | null;

  @prop()
  public width: number | null;

  @prop()
  public userId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OauthAccount extends Base {}
export class OauthAccount {
  @prop()
  public id: string;

  @prop()
  public clientId: string;

  @prop({ enum: OauthProvider, type: () => String })
  public type: OauthProvider;

  @prop()
  public linked: boolean;

  @prop()
  public mergeCode: string | null;

  @prop()
  public mergeCodeExpDate: Date | null;

  @prop()
  public userId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Profile extends Base {}
export class Profile extends TimeStamps {
  @prop()
  public id: string;

  @prop()
  public name: string | null;

  @prop()
  public surname: string | null;

  @prop()
  public birthday: Date | null;

  @prop()
  public city: string | null;

  @prop()
  public aboutMe: string | null;

  @prop()
  public userId: string;
}

export class PasswordRecovery {
  @prop()
  public recoveryCode: string | null;

  @prop()
  public expirationDate: string | null;

  @prop()
  public userId: string;
}
