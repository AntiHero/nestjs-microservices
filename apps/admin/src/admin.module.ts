import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { join } from 'path';

import { AdminService } from './admin.service';
import { AuthModule } from './auth/auth.module';
import { AdminResolver } from './admin.resolver';
import { UserModel } from './app/entity/user.model';
import { globalConfig } from './config/global.config';
import { postgresConfigFactory } from './config/typeorm.config';
import { mongooseConfigFactory } from './config/mongoose.config';
import { UsersQueryRepositoryProvider } from './database/users.query-repository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: postgresConfigFactory,
      inject: [ConfigService],
    }),
    TypegooseModule.forRootAsync({
      useFactory: mongooseConfigFactory,
      inject: [ConfigService],
    }),
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: 'users',
        },
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [globalConfig],
      envFilePath: [process.cwd() + '/apps/admin/.env'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // provides root type?
      autoSchemaFile: join(__dirname, 'schema/schema.gql'),
    }),
    AuthModule,
  ],
  providers: [AdminResolver, AdminService, UsersQueryRepositoryProvider],
})
export class AdminModule {}
