import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType }                                from '@nestjs/config';
import { Auth, google }                              from 'googleapis';

import { googleOauthConfig }                         from '../../config/google-oauth.config';

@Injectable()
export class GoogleAuthAdapter {
  oauthClient: Auth.OAuth2Client;

  public constructor(
    @Inject(googleOauthConfig.KEY)
    private readonly oauthConfig: ConfigType<typeof googleOauthConfig>,
  ) {
    this.oauthClient = new google.auth.OAuth2(
      this.oauthConfig.clientId,
      this.oauthConfig.clientSecret,
      'postmessage',
    );
  }

  public async validateUser(code: string) {
    const { tokens } = await this.oauthClient.getToken(code);

    if (!tokens || !tokens.access_token)
      throw new UnauthorizedException('code provided is not valid');

    const googleUserData = await this.getUserData(tokens.access_token);

    const { name, given_name, family_name, email, id } = googleUserData;

    if (!name || !email || !id)
      throw new UnauthorizedException('name, email or id are absent');

    return { name, given_name, family_name, email, id };
  }

  private async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });
    return userInfoResponse.data;
  }
}
