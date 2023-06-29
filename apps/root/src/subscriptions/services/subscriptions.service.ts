import { PaymentProvider }               from '.prisma/subscriptions';
import { PaymentsQueryDto }              from '@app/common/dtos/payments-query.dto';
import { GetCheckoutSessionUrlPayload }  from '@app/common/interfaces/get-checkout-session-url-payload.interface';
import { Payments }                      from '@app/common/interfaces/payments.interface';
import { PriceList }                     from '@app/common/interfaces/price-list.interface';
import { CurrentSubscriptionDbType }     from '@app/common/interfaces/subscriptions.interface';
import { SubscriptionCommand }           from '@app/common/patterns/subscriptions.pattern';
import { ClientToken }                   from '@app/common/tokens';
import { Result }                        from '@app/common/utils/result.util';
import { Inject, Injectable }            from '@nestjs/common';
import { ClientProxy }                   from '@nestjs/microservices';
import { Observable }                    from 'rxjs';

import { SubscriptionsServiceInterface } from './subscriptions.service-adapter';

@Injectable()
export class SubscriptionsService extends SubscriptionsServiceInterface {
  public constructor(
    @Inject(ClientToken.SUBSCRIPTIONS)
    private readonly subscriptionsClient: ClientProxy,
  ) {
    super();
  }

  public getPriceList(): Observable<PriceList[]> {
    return this.subscriptionsClient.send<PriceList[]>(
      SubscriptionCommand.GetPrices,
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
    >(SubscriptionCommand.GetCheckoutSessionUrl, {
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
    >(SubscriptionCommand.GetUserPayments, {
      userId,
      query,
    });
  }

  public cancelSubscription(userId: string): Observable<Result<null>> {
    return this.subscriptionsClient.send<Result<null>, { userId: string }>(
      SubscriptionCommand.CancelSubscription,
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
    >(SubscriptionCommand.GetCurrentSubscription, {
      userId,
    });
  }
}
