import { join }                             from 'path';

import { globalConfig }                     from '@app/common/config/global.config';
import { Queue }                            from '@app/common/queues';
import { RmqService }                       from '@app/common/src';
import { RmqModule }                        from '@app/common/src/rmq/rmq.module';
import { RmqClientToken }                   from '@app/common/tokens';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module }                           from '@nestjs/common';
import { ConfigModule, ConfigService }      from '@nestjs/config';
import { GraphQLModule }                    from '@nestjs/graphql';
import { TypeOrmModule }                    from '@nestjs/typeorm';
import { TypegooseModule }                  from 'nestjs-typegoose';

import { AdminController }                  from './admin.controller';
import { AdminResolver }                    from './admin.resolver';
import { AdminService }                     from './admin.service';
import { PaymentClass }                     from './app/entity/payments.model';
import { PostClass }                        from './app/entity/post.model';
import { UserClass }                        from './app/entity/user.model';
import { AuthModule }                       from './auth/auth.module';
import { localConfig }                      from './config/global.config';
import { mongooseConfigFactory }            from './config/mongoose.config';
import { postgresConfigFactory }            from './config/typeorm.config';
import { AdminMessageConroller }            from './controllers/message.controller';
import { PaymentsQueryRepositoryProvider }  from './db/repositories/payments/payments.query-repository';
import { PaymentsRepositoryProvider }       from './db/repositories/payments/payments.repository';
import { PostsRepositoryProvider }          from './db/repositories/post/post-repository';
import { PostsQueryRepositoryProvider }     from './db/repositories/post/posts.query-repository';
import { UsersQueryRepositoryProvider }     from './db/repositories/user/users.query-repository';
import { UsersRepositoryProvider }          from './db/repositories/user/users.repository';

@Module({
  imports: [
    ...AdminModule.setupTypegoose(),
    AdminModule.setupGraphql(),
    AdminModule.setupRmqClient(),
    AdminModule.setupTypeorm(),
    AdminModule.setupConfig(),
    AuthModule,
  ],
  controllers: [AdminController, AdminMessageConroller],
  providers: [
    AdminResolver,
    AdminService,
    UsersQueryRepositoryProvider,
    UsersRepositoryProvider,
    PostsRepositoryProvider,
    PostsQueryRepositoryProvider,
    PaymentsQueryRepositoryProvider,
    PaymentsRepositoryProvider,
    RmqService,
  ],
})
export class AdminModule {
  public static setupTypegoose() {
    return [
      TypegooseModule.forRootAsync({
        useFactory: mongooseConfigFactory,
        inject: [ConfigService],
      }),
      TypegooseModule.forFeature([
        {
          typegooseClass: UserClass,
          schemaOptions: {
            collection: 'users',
          },
        },
        {
          typegooseClass: PostClass,
          schemaOptions: {
            collection: 'posts',
          },
        },
        {
          typegooseClass: PaymentClass,
          schemaOptions: {
            collection: 'payments',
          },
        },
      ]),
    ];
  }

  public static setupGraphql() {
    return TypeOrmModule.forRootAsync({
      useFactory: postgresConfigFactory,
      inject: [ConfigService],
    });
  }

  public static setupTypeorm() {
    return GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(__dirname, 'schema/schema.gql'),
      plugins: [],
    });
  }

  public static setupRmqClient() {
    return RmqModule.register({
      name: RmqClientToken.ROOT_RMQ,
      queue: Queue.Root,
    });
  }

  public static setupConfig() {
    return ConfigModule.forRoot({
      isGlobal: true,
      load: [localConfig, globalConfig],
      envFilePath: [
        `${process.cwd()}/apps/admin/.env`,
        `${process.cwd()}/.env.global`,
      ],
    });
  }
}
