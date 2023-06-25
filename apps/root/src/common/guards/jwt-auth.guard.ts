import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwt') {}
export class RefreshTokenJwtGuard extends AuthGuard('jwt-refresh') {}
