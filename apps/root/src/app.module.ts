import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AdaptorModule } from './adaptors/adaptor.module';
import { googleOauthConfig } from './config/google-oauth.config';
import { githubOauthConfig } from './config/github-oauth.config';
import { configValidationSchema } from './config/validation-schema';
// import { stripeConfig } from '../../subscriptions/config/stripe.config';
import { globalConfig } from '@app/common/config/microservices.config';
import { TestingModule } from './testing-remove-all-data/testing.module';
import { DeviceSessionsModule } from './deviceSessions/device-sessions.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
// import { subscriptionsConfig } from '../../subscriptions/config/subscriptions.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
      load: [
        // stripeConfig,
        githubOauthConfig,
        googleOauthConfig,
        // subscriptionsConfig,
        globalConfig,
      ],
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    AdaptorModule,
    DeviceSessionsModule,
    TestingModule,
    SubscriptionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
