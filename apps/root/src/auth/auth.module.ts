import { Module }                            from '@nestjs/common';
import { CqrsModule }                        from '@nestjs/cqrs';
import { JwtModule }                         from '@nestjs/jwt';

import { ImageService }                      from 'apps/root/src/common/services/image.service';
import { SharpService }                      from 'apps/root/src/common/services/sharp.service';

import { AuthController }                    from './api/auth.controller';
import { DevicesSessionsService }            from './services/devices.service';
import { GithubUsersService }                from './services/github-users.service';
import { AtStrategy, RtStrategy }            from './strategies';
import { ConfirmRegistrationUseCase }        from './use-cases/confirm-registration-use-case';
import { LoginUserUseCase }                  from './use-cases/login-user-use-case';
import { LogoutUserUseCase }                 from './use-cases/logout-user-use-case';
import { MergeAccountsUseCase }              from './use-cases/merge-account.use-case';
import { NewPasswordUseCase }                from './use-cases/new-password.use-case';
import { PasswordRecoveryUserUseCase }       from './use-cases/password-recovery.use-case';
import { RegisterUserUseCase }               from './use-cases/register-user-use-case';
import { RegistrationEmailResendingUseCase } from './use-cases/registration-email-resending-use-case';
import { SignUpUserWithGithubUseCase }       from './use-cases/sign-up-user-with-github.use-case';
import { SignUpUserWithGoogleUseCase }       from './use-cases/sign-up-user-with-google.use-case';
import { AdaptorModule }                     from '../adaptors/adaptor.module';
import { EventRouter }                       from '../common/event-router';
import { AdminRmqClient }                    from '../common/services/admin-rmq-client.service';
import { DeviceSessionsModule }              from '../deviceSessions/device-sessions.module';
import { MailModule }                        from '../mail/mail.module';
import { UserModule }                        from '../user/user.module';

const useCases = [
  RegistrationEmailResendingUseCase,
  PasswordRecoveryUserUseCase,
  ConfirmRegistrationUseCase,
  SignUpUserWithGithubUseCase,
  RegisterUserUseCase,
  MergeAccountsUseCase,
  NewPasswordUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  SignUpUserWithGoogleUseCase,
];

@Module({
  imports: [
    CqrsModule,
    MailModule,
    UserModule,
    JwtModule.register({}),
    AdaptorModule,
    DeviceSessionsModule,
  ],
  controllers: [AuthController],
  providers: [
    AtStrategy,
    RtStrategy,
    GithubUsersService,
    DevicesSessionsService,
    {
      provide: ImageService,
      useClass: SharpService,
    },
    AdminRmqClient,
    EventRouter,
    ...useCases,
  ],
  exports: [],
})
export class AuthModule {}
