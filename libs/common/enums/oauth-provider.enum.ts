import { OauthProvider as OauthProviderEnum } from '@prisma/client';

export const OauthProvider: typeof OauthProviderEnum = {
  GITHUB: 'GITHUB',
  GOOGLE: 'GOOGLE',
};

export type OauthProvider = OauthProviderEnum;
