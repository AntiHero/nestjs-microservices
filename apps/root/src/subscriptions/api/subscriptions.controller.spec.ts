import { CircuitBrakerParams }           from '@app/common/interceptors/circuit-breaker/cirucit-breaker.enum';
import { Result }                        from '@app/common/utils/result.util';
import { INestApplication }              from '@nestjs/common';
import { Test, TestingModule }           from '@nestjs/testing';
// import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { Observable }                    from 'rxjs';
import request                           from 'supertest';

import { SubscriptionsController }       from './subscriptions.controller';
import { SubscriptionsService }          from '../services/subscriptions.service';
import { SubscriptionsServiceInterface } from '../services/subscriptions.service-adapter';

// const moduleMocker = new ModuleMocker(global);

jest.mock('../services/subscriptions.service.ts', () => {
  const MockedClass = class SubscriptionsService {
    public getCheckoutSessionUrl() {
      return new Observable((subscriber) => {
        subscriber.next(Promise.resolve('url'));
      });
    }
  };

  return { SubscriptionsService: MockedClass };
});

jest.mock('apps/root/src/common/guards/jwt-auth.guard.ts', () => {
  const MockedGuard = class MockClass {
    canActivate = () => true;
  };

  return { JwtGuard: MockedGuard };
});

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let subscriptionsService: SubscriptionsService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: SubscriptionsServiceInterface,
          useClass: SubscriptionsService,
        },
        {
          provide: 'SUBSCRIPTIONS',
          useValue: {},
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: {},
        },
      ],
    })
      // .useMocker((token) => {
      //   console.log(token);
      //   if (token === 'CACHE_MANAGER') return {};
      //
      //   if (typeof token === 'function') {
      //     const mockMetadata = moduleMocker.getMetadata(
      //       token,
      //     ) as MockFunctionMetadata<any, any>;
      //     const Mock = moduleMocker.generateFromMetadata(mockMetadata);
      //
      //     return new Mock();
      //   }
      // })
      .compile();

    app = moduleFixture.createNestApplication();
    subscriptionsService = app.get(SubscriptionsServiceInterface);
    await app.init();
  });

  it('should break circuit after 3 bad calls and restore after timeout', async () => {
    await request(app.getHttpServer())
      .post('/api/subscriptions/checkout-session')
      .expect(200);

    // simulate connection error
    const getCheckoutSessionUrlSpy = jest.fn(() => {
      return new Observable<Result<string>>((subscriber) => {
        subscriber.error();
      });
    });

    jest
      .spyOn(subscriptionsService, 'getCheckoutSessionUrl')
      .mockImplementation(getCheckoutSessionUrlSpy);

    await Promise.all([
      request(app.getHttpServer())
        .post('/api/subscriptions/checkout-session')
        .expect(500),
      request(app.getHttpServer())
        .post('/api/subscriptions/checkout-session')
        .expect(500),
      request(app.getHttpServer())
        .post('/api/subscriptions/checkout-session')
        .expect(500),
      request(app.getHttpServer())
        .post('/api/subscriptions/checkout-session')
        .expect(500),
      request(app.getHttpServer())
        .post('/api/subscriptions/checkout-session')
        .expect(500),
      request(app.getHttpServer())
        .post('/api/subscriptions/checkout-session')
        .expect(500),
    ]);

    expect(getCheckoutSessionUrlSpy).toHaveBeenCalledTimes(3);

    const originalNow = Date.now;

    Date.now = jest.fn(() => originalNow() + CircuitBrakerParams.RESET_TIMEOUT);

    await request(app.getHttpServer()).post(
      '/api/subscriptions/checkout-session',
    );

    expect(getCheckoutSessionUrlSpy).toHaveBeenCalledTimes(4);

    Date.now = originalNow;
  });

  afterAll(async () => {
    await app.close();
  });
});
