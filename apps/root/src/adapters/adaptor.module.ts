import { Module }               from '@nestjs/common';
import { JwtModule }            from '@nestjs/jwt';

import { BcryptAdapter }        from './bcrypt/bcrypt.adapter';
import { GoogleAuthAdapter }    from './google/google-auth.adapter';
import { JwtAdapter }           from './jwt/jwt.adapter';
import { DeviceSessionsModule } from '../deviceSessions/device-sessions.module';
import { UserModule }           from '../user/user.module';

@Module({
  imports: [UserModule, DeviceSessionsModule, JwtModule.register({})],
  controllers: [],
  providers: [JwtAdapter, BcryptAdapter, GoogleAuthAdapter],
  exports: [JwtAdapter, BcryptAdapter, GoogleAuthAdapter],
})
export class AdaptorModule {}
