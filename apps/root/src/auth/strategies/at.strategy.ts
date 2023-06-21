import {
  BadRequestException,
  ForbiddenException,
  Injectable,
}                                 from '@nestjs/common';
import { ConfigService }          from '@nestjs/config';
import { PassportStrategy }       from '@nestjs/passport';
import { Request as RequestType } from 'express';
import { ExtractJwt, Strategy }   from 'passport-jwt';

import { JwtAdaptor }             from '../../adaptors/jwt/jwt.adaptor';
import { ActiveUserData }         from '../../user/types';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private readonly jwtAdaptor: JwtAdaptor) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('AT_SECRET'),
      passReqToCallback: true,
    });
  }
  async validate(request: RequestType, payload: ActiveUserData) {
    const accessToken = request
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    if (!accessToken) throw new ForbiddenException('Access token malformed');
    if (!payload) {
      throw new BadRequestException('invalid jwt token');
    }
    await this.jwtAdaptor.validateAtToken(accessToken, payload.deviceId);
    return payload;
  }
}
