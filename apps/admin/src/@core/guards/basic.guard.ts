import { IS_PUBLIC_KEY }       from '@app/common/decorators/public.decorator';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector }           from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError }        from 'graphql';

import { AuthService }         from '../../auth/auth.service';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  public constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = GqlExecutionContext.create(context)?.getContext()?.req;

    const [schema, payload] = req.headers['authorization']?.split(' ') || [];

    const decodeResult = this.decode(payload);

    if (schema?.toLowerCase() !== 'basic' || !decodeResult)
      throw new GraphQLError('You are not authorized to perform this action.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });

    const [email, password] = decodeResult.split(':');

    const validationResult = await this.authService.validate(email, password);

    if (!validationResult)
      throw new GraphQLError('You are not authorized to perform this action.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });

    return true;
  }

  private decode(payload: string) {
    if (!payload) return null;

    return Buffer.from(payload, 'base64').toString();
  }
}
