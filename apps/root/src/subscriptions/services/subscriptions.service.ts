import { SUBSCRIPTIONS_PATTERNS } from '@app/common/patterns/subscriptions.patterns';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { PaymentProvider } from '.prisma/subscriptions';
import { PriceList } from '@app/common/interfaces/price-list.interface';
import { SubscriptionsServiceAdapter } from './subscriptions.service-adapter';
import { GetCheckoutSessionUrlPayload } from '@app/common/interfaces/get-checkout-session-url-payload.interface';
import { ErrorResult, Result } from '@app/common/interfaces/result.interface';
import { Payments } from '@app/common/interfaces/payments.interface';
import { PaymentsQueryDto } from '@app/common/dto/payments-query.dto';
import { CurrentSubscriptionDbType } from '@app/common/interfaces/subscriptions.interface';

@Injectable()
export class SubscriptionsService extends SubscriptionsServiceAdapter {
  public constructor(
    @Inject('SUBSCRIPTIONS') private readonly subscriptionsClient: ClientProxy,
  ) {
    super();
  }

  public getPriceList(): Observable<PriceList[]> {
    return this.subscriptionsClient.send<PriceList[]>(
      SUBSCRIPTIONS_PATTERNS.GET_PRICES(),
      {},
    );
  }

  public getCheckoutSessionUrl({
    userId,
    priceId,
    paymentSystem,
  }: {
    userId: string;
    priceId: string;
    paymentSystem: PaymentProvider;
  }): Observable<Result<string>> {
    return this.subscriptionsClient.send<
      Result<string>,
      GetCheckoutSessionUrlPayload
    >(SUBSCRIPTIONS_PATTERNS.GET_CHECKOUT_SESSION_URL(), {
      userId,
      priceId,
      paymentSystem,
    });
  }

  public getPayments(
    userId: string,
    query: PaymentsQueryDto,
  ): Observable<Result<[number, Payments[]]>> {
    return this.subscriptionsClient.send<
      Result<[number, Payments[]]>,
      { userId: string; query: PaymentsQueryDto }
    >(SUBSCRIPTIONS_PATTERNS.GET_PAYMENTS(), {
      userId,
      query,
    });
  }

  public cancelSubscription(userId: string): Observable<Result> {
    return this.subscriptionsClient.send<Result, { userId: string }>(
      SUBSCRIPTIONS_PATTERNS.CANCEL_SUBSCRIPTION(),
      {
        userId,
      },
    );
  }

  public getCurrentSubscription(
    userId: string,
  ): Observable<Result<CurrentSubscriptionDbType>> {
    return this.subscriptionsClient.send<
      Result<CurrentSubscriptionDbType>,
      { userId: string }
    >(SUBSCRIPTIONS_PATTERNS.GET_CURRENT_SUBSCRIPTION(), {
      userId,
    });
  }
}
