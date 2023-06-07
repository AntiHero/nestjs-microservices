import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AdaptorModule } from './adaptors/adaptor.module';
import { googleOauthConfig } from './config/google-oauth.config';
import { TcpController } from './controllers/tcp.controller';
import { githubOauthConfig } from './config/github-oauth.config';
import { configValidationSchema } from './config/validation-schema';
import { globalConfig } from '@app/common/config/global.config';
import { TestingModule } from './testing-remove-all-data/testing.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { DeviceSessionsModule } from './deviceSessions/device-sessions.module';

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
  ],
  controllers: [AppController, TcpController],
})
export class AppModule {}
