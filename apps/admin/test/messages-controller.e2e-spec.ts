import { confirmedEmailMessageCreator } from '@app/common/message-creators/confirmed-email.message-creator';
import { createdUserMessageCreator }    from '@app/common/message-creators/created-user.message-creator';
import { updatedAvatarMessageCreator }  from '@app/common/message-creators/updated-avatar.message-creator';
import { updatedProfileMessageCreator } from '@app/common/message-creators/updated-profile.message-creator';
import { RootEvent }                    from '@app/common/patterns';
import { Queue }                        from '@app/common/queues';
import { RmqService }                   from '@app/common/src';
import { RmqModule }                    from '@app/common/src/rmq/rmq.module';
import { RmqClientToken }               from '@app/common/tokens';
import { INestApplication }             from '@nestjs/common';
import { Test, TestingModule }          from '@nestjs/testing';
import mongoose                         from 'mongoose';

import testUsers                        from './mock-data/users.json';
import { AdminModule }                  from '../src/admin.module';
import { PostModel }                    from '../src/app/entity/post.model';
import { UserModel }                    from '../src/app/entity/user.model';
import { AdminMessageConroller }        from '../src/controllers/message.controller';
import { PostsRepositoryProvider }      from '../src/db/repositories/post/post-repository';
import { UsersRepositoryProvider }      from '../src/db/repositories/user/users.repository';

jest.mock('@app/common/src/rmq/rmq.service.ts', () => {
  const original = jest.requireActual('@app/common/src/rmq/rmq.service.ts');

  original.RmqService.prototype.ack = jest.fn(() => {
    null;
  });
  return {
    ...original,
  };
});

describe('AdminController (e2e)', () => {
  let app: INestApplication;
  let userCollection: mongoose.Collection<UserModel>;
  let postsCollection: mongoose.Collection<PostModel>;

  beforeAll(async () => {
    const uri = <string>process.env.MONGODB_URI;

    await mongoose.connect(uri).then(
      () => console.log('mongo connected'),
      () => console.log('connection error'),
    );
  });

  let client: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ...AdminModule.setupTypegoose(),
        AdminModule.setupConfig(),
        RmqModule.register({
          name: RmqClientToken.ADMIN_RMQ,
          queue: Queue.Admin,
        }),
      ],
      controllers: [AdminMessageConroller],
      providers: [RmqService, UsersRepositoryProvider, PostsRepositoryProvider],
    }).compile();

    app = moduleFixture.createNestApplication();

    const rmqService = app.get<RmqService>(RmqService);
    client = app.connectMicroservice(rmqService.getOptions(Queue.Admin));

    await app.init();
  });

  // local rabbit mq server must be started to run tests
  describe('users', () => {
    beforeEach(async () => {
      const { createdAt, id, email, username } = testUsers[0];

      await client.server.messageHandlers.get(RootEvent.CreatedUser)(
        createdUserMessageCreator({
          id,
          email,
          username,
          createdAt: new Date(createdAt),
        }),
      );

      userCollection = mongoose.connection.collection('users');

      await userCollection.deleteMany({});
    });

    test('should create user', async () => {
      const { createdAt, id, email, username } = testUsers[0];

      const createdUser = await mongoose.connection
        .collection('users')
        .findOne({
          id,
        });

      expect(createdUser).not.toBe(null);
      expect(createdUser).toMatchObject({
        id,
        email,
        username,
        createdAt: new Date(createdAt),
        avatar: null,
        profile: null,
        isBanned: false,
        isDeleted: false,
        isEmailConfirmed: false,
      });
    });

    test('should confirm email', async () => {
      const { id } = testUsers[0];

      const createdUser = await mongoose.connection
        .collection('users')
        .findOne({
          id,
        });

      expect(createdUser?.isEmailConfirmed).toBeFalsy();

      await client.server.messageHandlers.get(RootEvent.ConfirmedEmail)(
        confirmedEmailMessageCreator({
          userId: testUsers[0].id,
          isEmailConfirmed: true,
        }),
      );

      const updatedUser = await mongoose.connection
        .collection('users')
        .findOne({
          id,
        });

      expect(updatedUser?.isEmailConfirmed).toBeTruthy();
    });

    test('should update profile', async () => {
      const { id } = testUsers[0];

      const createdUser = await mongoose.connection
        .collection('users')
        .findOne({
          id,
        });

      expect(createdUser?.profile).toBe(null);

      await client.server.messageHandlers.get(RootEvent.UpdatedProfile)(
        updatedProfileMessageCreator({
          userId: id,
          aboutMe: 'RPD rookie',
          city: 'Raccoon',
          surname: 'Kennedy',
        }),
      );

      let updatedUser = await mongoose.connection.collection('users').findOne({
        id,
      });

      expect(updatedUser).toMatchObject({
        profile: {
          aboutMe: 'RPD rookie',
          city: 'Raccoon',
          surname: 'Kennedy',
        },
      });

      await client.server.messageHandlers.get(RootEvent.UpdatedProfile)(
        updatedProfileMessageCreator({
          userId: id,
          name: 'Leon',
        }),
      );

      updatedUser = await mongoose.connection.collection('users').findOne({
        id,
      });

      expect(updatedUser).toMatchObject({
        profile: {
          aboutMe: 'RPD rookie',
          city: 'Raccoon',
          surname: 'Kennedy',
          name: 'Leon',
        },
      });
    });

    test.only('should update avatar', async () => {
      const { id } = testUsers[0];

      const createdUser = await mongoose.connection
        .collection('users')
        .findOne({
          id,
        });

      expect(createdUser?.profile).toBe(null);

      await client.server.messageHandlers.get(RootEvent.UpdatedAvatar)(
        updatedAvatarMessageCreator({
          userId: id,
          url: 'url',
          previewUrl: 'preview.url',
        }),
      );

      let updatedUser = await mongoose.connection.collection('users').findOne({
        id,
      });

      expect(updatedUser).toMatchObject({
        avatar: {
          url: 'url',
          previewUrl: 'preview.url',
        },
      });

      await client.server.messageHandlers.get(RootEvent.UpdatedAvatar)(
        updatedAvatarMessageCreator({
          userId: id,
          url: 'new_url',
          previewUrl: 'new_preview.url',
        }),
      );

      updatedUser = await mongoose.connection.collection('users').findOne({
        id,
      });

      expect(updatedUser).toMatchObject({
        avatar: {
          url: 'new_url',
          previewUrl: 'new_preview.url',
        },
      });
    });
  });

  describe('posts', async () => {
    beforeAll(async () => {
      const { createdAt, id, email, username } = testUsers[0];

      userCollection = mongoose.connection.collection('users');

      await userCollection.deleteMany({});

      await client.server.messageHandlers.get(RootEvent.CreatedUser)(
        createdUserMessageCreator({
          id,
          email,
          username,
          createdAt: new Date(createdAt),
        }),
      );
    });

    beforeEach(async () => {
      postsCollection = mongoose.connection.collection('posts');
    });
  });

  afterAll(async () => {
    await Promise.all([mongoose.disconnect(), app.close()]);
  });
});
