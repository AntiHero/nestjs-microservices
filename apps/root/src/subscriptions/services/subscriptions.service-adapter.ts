import { PaymentsQueryDto }             from '@app/common/dtos/payments-query.dto';
import { GetCheckoutSessionUrlPayload } from '@app/common/interfaces/get-checkout-session-url-payload.interface';
import { Payments }                     from '@app/common/interfaces/payments.interface';
import { PriceList }                    from '@app/common/interfaces/price-list.interface';
import { CurrentSubscriptionDbType }    from '@app/common/interfaces/subscriptions.interface';
import { Result }                       from '@app/common/utils/result.util';
import { Injectable }                   from '@nestjs/common';
import { Observable }                   from 'rxjs';

@Injectable()
export abstract class SubscriptionsServiceInterface {
  public abstract getPriceList(): Observable<PriceList[]>;

  public abstract getCheckoutSessionUrl({
    userId,
    priceId,
    paymentSystem,
  }: GetCheckoutSessionUrlPayload): Observable<Result<string>>;

  public abstract getPayments(
    userId: string,
    query: PaymentsQueryDto,
  ): Observable<Result<[number, Payments[]]>>;

  public abstract cancelSubscription(userId: string): Observable<Result<null>>;

  public abstract getCurrentSubscription(
    userId: string,
  ): Observable<Result<CurrentSubscriptionDbType>>;
}
