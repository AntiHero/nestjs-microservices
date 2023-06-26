import { RmqClientToken }                from '@app/common/tokens';
import { CanActivate, INestApplication } from '@nestjs/common';
import { Test, TestingModule }           from '@nestjs/testing';
import mongoose                          from 'mongoose';
import request                           from 'supertest';

import { AdminModule }                   from './../src/admin.module';
import testUsers                         from './mock-data/users.json';

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
    })
      .overrideProvider(RmqClientToken.ROOT_RMQ)
      .useValue({
        emit() {
          null;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('users', () => {
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

    describe('users queries', () => {
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

    describe('users mutations', () => {
      test('should ban user', async () => {
        const userInfo = `
        query {
          userInfo(id: "${testUser1.id}") {
            isBanned
            banReason
          }
        }
      `;

        await request(app.getHttpServer())
          .post('/graphql')
          .send({ query: userInfo })
          .expect(200)
          .then((response) => {
            expect(response.body.data.userInfo.isBanned).toBe(false);
            expect(response.body.data.userInfo.banReason).toBe('');
          });

        const banUser = `
          mutation {
            banUser(input: { id: "${testUser1.id}", banReason: "Another reason" }) 
          }
      `;

        await request(app.getHttpServer())
          .post('/graphql')
          .send({ query: banUser })
          .expect(200)
          .then((response) => {
            expect(response.body.data.banUser).toBe(true);
          });

        const userList = `
        query {
          userList(sortField: DateAdded, sortDirection: Asc, banFilter: Banned) {
            id
          }
        }
      `;

        await request(app.getHttpServer())
          .post('/graphql')
          .send({ query: userList })
          .expect(200)
          .then((response) => {
            expect(response.body.data.userList.length).toBe(1);
            expect(response.body.data.userList[0]).toMatchObject({
              id: testUser1.id,
            });
          });
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
