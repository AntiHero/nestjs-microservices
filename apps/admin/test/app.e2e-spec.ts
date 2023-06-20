import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AdminModule } from './../src/admin.module';
import mongoose from 'mongoose';

const testUsers = [
  {
    id: '76075d78-763a-43bf-a56b-488ce44541a1',
    username: 'alice_test',
    email: 'alice@gmail.com',
    createdAt: '2023-05-27T15:43:33.931Z',
    accountPlan: 'PERSONAL',
    isBanned: false,
    avatar: {
      url: 'https://avatars.githubusercontent.com/u/109024996?v=4',
      previewUrl: 'https://avatars.githubusercontent.com/u/109024996?v=4',
    },
    profile: {
      name: 'alice',
      surname: null,
      birthday: null,
      city: null,
      aboutMe: null,
    },
    isDeleted: false,
  },
  {
    id: '279bf07e-b0c5-456b-b1d5-69a01e62fa54',
    username: 'bob_test',
    email: 'bob@gmail.com',
    createdAt: '2023-05-30T14:38:00.266Z',
    accountPlan: 'PERSONAL',
    isBanned: false,
    avatar: {
      url: 'https://inctagram.storage.yandexcloud.net/content/users/279bf07e-b0c5-456b-b1d5-69a01e62fa54/avatar/15d8227d-a175-465a-9477-f43a08cbbfeb.jpg',
      previewUrl:
        'https://inctagram.storage.yandexcloud.net/content/users/279bf07e-b0c5-456b-b1d5-69a01e62fa54/avatar/.preivew.9ba8c974-8544-4479-864a-f1e2d4617c5c.jpg',
    },
    profile: {
      name: 'bob',
      surname: null,
      birthday: null,
      city: null,
      aboutMe: null,
    },
    isDeleted: false,
  },
];

jest.mock('apps/admin/src/@core/guards/basic.guard.ts', () => {
  class MockedGuard implements CanActivate {
    canActivate(): boolean {
      return true;
    }
  }
  return { BasicAuthGuard: MockedGuard };
});

describe('AdminController (e2e)', () => {
  let app: INestApplication;
  let userCollection: mongoose.Collection<mongoose.AnyObject>;

  beforeAll(async () => {
    const uri = <string>process.env.MONGODB_URI;

    await mongoose.connect(uri).then(
      () => console.log('mongo connected'),
      () => console.log('connection error'),
    );

    userCollection = mongoose.connection.collection('users');

    await userCollection.deleteMany({});
    await userCollection.insertMany(testUsers);
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AdminModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('users query', () => {
    const testUser1 = {
      id: testUsers[0].id,
      username: testUsers[0].username,
      profileLink: 'https://inctagram-m9ju.vercel.app/users/alice_test',
      dateAdded: testUsers[0].createdAt,
    };

    const testUser2 = {
      id: testUsers[1].id,
      username: testUsers[1].username,
      profileLink: 'https://inctagram-m9ju.vercel.app/users/bob_test',
      dateAdded: testUsers[1].createdAt,
    };

    test('should return user list', async () => {
      expect.assertions(2);

      const query = `
      query {
        userList {
          id
          username
          profileLink
          dateAdded
        }
      }
    `;

      await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .then((response) => {
          expect(response.body.data.userList.length).toBe(2);
          expect(response.body.data.userList).toStrictEqual([
            testUser2,
            testUser1,
          ]);
        });
    });

    test('should sort users by username, desc by default', async () => {
      expect.assertions(4);

      const query = `
        query {
          userList(sortField: Username) {
            id
            username
            profileLink
            dateAdded
          }
        }
      `;

      await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .then((response) => {
          expect(response.body.data.userList.length).toBe(2);
          expect(response.body.data.userList).toStrictEqual([
            testUser2,
            testUser1,
          ]);
        });

      const queryWithSortingAsc = `
        query {
          userList(sortField: Username, sortDirection: Asc) {
            id
            username
            profileLink
            dateAdded
          }
        }
      `;

      await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: queryWithSortingAsc })
        .expect(200)
        .then((response) => {
          expect(response.body.data.userList.length).toBe(2);
          expect(response.body.data.userList).toStrictEqual([
            testUser1,
            testUser2,
          ]);
        });
    });

    test('should sort users by createdAt date', async () => {
      expect.assertions(4);

      const query = `
        query {
          userList(sortField: DateAdded) {
            id
            username
            profileLink
            dateAdded
          }
        }
      `;

      await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .then((response) => {
          expect(response.body.data.userList.length).toBe(2);
          expect(response.body.data.userList).toStrictEqual([
            testUser2,
            testUser1,
          ]);
        });

      const queryWithSortingAsc = `
        query {
          userList(sortField: DateAdded, sortDirection: Asc) {
            id
            username
            profileLink
            dateAdded
          }
        }
      `;

      await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: queryWithSortingAsc })
        .expect(200)
        .then((response) => {
          expect(response.body.data.userList.length).toBe(2);
          expect(response.body.data.userList).toStrictEqual([
            testUser1,
            testUser2,
          ]);
        });
    });
  });

  afterAll(async () => {
    await Promise.all([app.close(), userCollection.deleteMany({})]);
    await mongoose.disconnect();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });
});
