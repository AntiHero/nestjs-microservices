import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { join } from 'path';

import { AdminService } from './admin.service';
import { AuthModule } from './auth/auth.module';
import { AdminResolver } from './admin.resolver';
import { postgresConfigFactory } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: postgresConfigFactory,
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [process.cwd() + '/apps/admin/.env'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // provides root type?
      autoSchemaFile: join(__dirname, 'schema/schema.gql'),
    }),
    AuthModule,
  ],
  providers: [AdminResolver, AdminService],
})
export class AdminModule {}
