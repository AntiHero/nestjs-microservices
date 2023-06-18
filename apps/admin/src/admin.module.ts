import { globalConfig } from '@app/common/config/global.config';
import { RmqModule } from '@app/common/src/rmq/rmq.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypegooseModule } from 'nestjs-typegoose';
import { join } from 'path';
import { AdminController } from './admin.controller';

import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';
import { PostModel } from './app/entity/post.model';
import { PaymentModel } from './app/entity/subscriptions.model';
import { UserModel } from './app/entity/user.model';
import { AuthModule } from './auth/auth.module';
import { localConfig } from './config/global.config';
import { mongooseConfigFactory } from './config/mongoose.config';
import { postgresConfigFactory } from './config/typeorm.config';
import { PaymentsQueryRepositoryProvider } from './database/payments.query-repository';
import { PostsQueryRepositoryProvider } from './database/posts.query-repository';
import { UsersQueryRepositoryProvider } from './database/users.query-repository';
import { UsersRepositoryProvider } from './database/users.repository';

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
      {
        typegooseClass: PostModel,
        schemaOptions: {
          collection: 'posts',
        },
      },
      {
        typegooseClass: PaymentModel,
        schemaOptions: {
          collection: 'payments',
        },
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [localConfig, globalConfig],
      envFilePath: [
        `${process.cwd()}/apps/admin/.env`,
        `${process.cwd()}/.env.global`,
      ],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // provides root type?
      autoSchemaFile: join(__dirname, 'schema/schema.gql'),
      plugins: [],
    }),
    AuthModule,
    RmqModule.register({
      name: 'ROOT_RMQ',
      queue: 'main',
    }),
  ],
  controllers: [AdminController],
  providers: [
    AdminResolver,
    AdminService,
    UsersQueryRepositoryProvider,
    UsersRepositoryProvider,
    PostsQueryRepositoryProvider,
    PaymentsQueryRepositoryProvider,
  ],
})
export class AdminModule {}
