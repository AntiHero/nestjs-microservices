import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService }                     from '@nestjs/config';
import { JwtService }                        from '@nestjs/jwt';
import * as argon                            from 'argon2';

import { DeviceSessionsRepository }          from '../../deviceSessions/repositories/device-sessions.repository';
import { ActiveUserData }                    from '../../user/types';

@Injectable()
export class JwtAdapter {
  public constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private deviceSessionsRepository: DeviceSessionsRepository,
  ) {}

  public async getTokens(userId: string, userName: string, deviceId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId, deviceId },
        {
          secret: this.config.get<string>('AT_SECRET'),
          expiresIn: '10m',
        },
      ),
      this.jwtService.signAsync(
        { userId, deviceId },
        {
          secret: this.config.get<string>('RT_SECRET'),
          expiresIn: '2h',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async updateTokensHash(tokens: {
    accessToken: string;
    refreshToken: string;
  }) {
    const accessTokenHash = await argon.hash(tokens.accessToken);
    const refreshTokenHash = await argon.hash(tokens.refreshToken);
    return {
      accessTokenHash,
      refreshTokenHash,
    };
  }

  public async refreshToken(user: ActiveUserData) {
    //  create new pair of tokens
    const tokens = await this.getTokens(
      user.userId,
      user.username,
      user.deviceId,
    );
    const hashedTokens = await this.updateTokensHash(tokens);
    await this.deviceSessionsRepository.updateTokensByDeviceSessionId(
      user.deviceId,
      hashedTokens,
    );

    return tokens;
  }

  public async validateRtToken(refreshToken: string, deviceId: string) {
    const isJwt =
      await this.deviceSessionsRepository.findTokensByDeviceSessionId(deviceId);

    if (!isJwt)
      throw new UnauthorizedException(
        'token has expired or is no longer valid',
      );

    const rtMatches = await argon.verify(isJwt.refreshTokenHash, refreshToken);
    if (!rtMatches) throw new UnauthorizedException('Access denied');
    return true;
  }

  public async validateAtToken(accessToken: string, deviceId: string) {
    const isJwt =
      await this.deviceSessionsRepository.findTokensByDeviceSessionId(deviceId);

    if (!isJwt)
      throw new UnauthorizedException(
        'token has expired or is no longer valid',
      );

    const rtMatches = await argon.verify(isJwt.accessTokenHash, accessToken);

    if (!rtMatches) throw new UnauthorizedException('Access denied');

    return true;
  }
}
