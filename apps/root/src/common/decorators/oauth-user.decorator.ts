import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';

import { Oauth20UserData } from '../../user/types';

export const OauthUserDecorator = createParamDecorator(
  (_: undefined, context: ExecutionContext): Oauth20UserData => {
    const request = context.switchToHttp().getRequest();

    const user: Oauth20UserData = request.user;

    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    return user;
  },
);
