import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AuthService } from '../../auth/auth.service';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  public constructor(private readonly authService: AuthService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = GqlExecutionContext.create(context)?.getContext()?.req;

    const [schema, payload] = req.headers['authorization']?.split(' ') || [];

    const decodeResult = this.decode(payload);

    if (schema?.toLowerCase() !== 'basic' || !decodeResult)
      throw new UnauthorizedException();

    const [email, password] = decodeResult.split(':');

    const validationResult = await this.authService.validate(email, password);

    if (!validationResult) throw new UnauthorizedException();

    return true;
  }

  private decode(payload: string) {
    if (!payload) return null;

    return Buffer.from(payload, 'base64').toString();
  }
}
