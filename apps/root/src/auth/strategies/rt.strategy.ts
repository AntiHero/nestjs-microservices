import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService }                   from '@nestjs/config';
import { ModuleRef }                       from '@nestjs/core';
import { PassportStrategy }                from '@nestjs/passport';
import { Request as RequestType }          from 'express';
import { ExtractJwt, Strategy }            from 'passport-jwt';

import { JwtAdaptor }                      from '../../adaptors/jwt/jwt.adaptor';
import { ActiveUserData }                  from '../../user/types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private moduleRef: ModuleRef,
    config: ConfigService,
    private readonly jwtAdaptor: JwtAdaptor,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: RequestType) => {
          const data = request?.cookies.refreshToken;
          if (!data) {
            return null;
          }
          return data;
        },
      ]),
      passReqToCallback: true,
      ignoreExpiration: false,
      secretOrKey: config.get<string>('RT_SECRET'),
    });
  }

  async validate(request: RequestType, payload: ActiveUserData) {
    if (!payload) {
      throw new BadRequestException('invalid jwt token');
    }
    const refreshToken = request?.cookies.refreshToken;

    if (!refreshToken) {
      throw new BadRequestException('invalid refresh token');
    }
    await this.jwtAdaptor.validateRtToken(refreshToken, payload.deviceId);
    return payload;
  }
}
