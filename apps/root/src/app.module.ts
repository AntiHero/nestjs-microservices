import { globalConfig }           from '@app/common/config/global.config';
import { Module }                 from '@nestjs/common';
import { ConfigModule }           from '@nestjs/config';
import { EventEmitterModule }     from '@nestjs/event-emitter';

import { AdaptorModule }          from './adapters/adaptor.module';
import { AppController }          from './app.controller';
import { AuthModule }             from './auth/auth.module';
import { githubOauthConfig }      from './config/github-oauth.config';
import { googleOauthConfig }      from './config/google-oauth.config';
import { configValidationSchema } from './config/validation-schema';
import { TcpController }          from './controllers/message.controller';
import { DeviceSessionsModule }   from './deviceSessions/device-sessions.module';
import { PrismaModule }           from './prisma/prisma.module';
import { RmqModule }              from './rmq/rmq.module';
import { SubscriptionsModule }    from './subscriptions/subscriptions.module';
import { TestingModule }          from './testing-remove-all-data/testing.module';
import { UserModule }             from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
      load: [githubOauthConfig, googleOauthConfig, globalConfig],
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    AdaptorModule,
    DeviceSessionsModule,
    TestingModule,
    SubscriptionsModule,
    RmqModule,
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: ':',
    }),
    // RmqModule.register({
    //   name: 'ADMIN_RMQ',
    //   queue: 'admin',
    // }),
  ],
  controllers: [AppController, TcpController],
})
export class AppModule {}
