import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Result } from '@app/common/interfaces/result.interface';
import { PriceList } from '@app/common/interfaces/price-list.interface';
import { GetCheckoutSessionUrlPayload } from '@app/common/interfaces/get-checkout-session-url-payload.interface';

@Injectable()
export abstract class SubscriptionsServiceAdapter {
  public abstract getPriceList(): Observable<PriceList[]>;

  public abstract getCheckoutSessionUrl({
    userId,
    priceId,
    paymentSystem,
  }: GetCheckoutSessionUrlPayload): Observable<Result<string>>;
}
