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
import { localConfig } from './config/global.config';
import { RmqModule } from '@app/common/src/rmq/rmq.module';
import { postgresConfigFactory } from './config/typeorm.config';
import { globalConfig } from '@app/common/config/global.config';
import { mongooseConfigFactory } from './config/mongoose.config';
import { UsersRepositoryProvider } from './database/users.repository';
import { PostsQueryRepositoryProvider } from './database/posts.query-repository';
import { UsersQueryRepositoryProvider } from './database/users.query-repository';
import { PostModel } from './app/entity/post.model';

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
  providers: [
    AdminResolver,
    AdminService,
    UsersQueryRepositoryProvider,
    UsersRepositoryProvider,
    PostsQueryRepositoryProvider,
  ],
})
export class AdminModule {}
