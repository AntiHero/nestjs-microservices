import { join } from 'path';

import { globalConfig } from '@app/common/config/global.config';
import { Queue } from '@app/common/queues';
import { RmqService } from '@app/common/src';
import { RmqModule } from '@app/common/src/rmq/rmq.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypegooseModule } from 'nestjs-typegoose';

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
import { AdminMessageConroller } from './controllers/message.controller';
import { PaymentsQueryRepositoryProvider } from './db/payments.query-repository';
import { PostsQueryRepositoryProvider } from './db/posts.query-repository';
import { UsersQueryRepositoryProvider } from './db/users.query-repository';
import { UsersRepositoryProvider } from './db/users.repository';

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
      autoSchemaFile: join(__dirname, 'schema/schema.gql'),
      plugins: [],
    }),
    AuthModule,
    RmqModule.register({
      name: 'ROOT_RMQ',
      queue: Queue.Root,
    }),
  ],
  controllers: [AdminController, AdminMessageConroller],
  providers: [
    AdminResolver,
    AdminService,
    UsersQueryRepositoryProvider,
    UsersRepositoryProvider,
    PostsQueryRepositoryProvider,
    PaymentsQueryRepositoryProvider,
    RmqService,
  ],
})
export class AdminModule {}
