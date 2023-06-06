import { SUBSCRIPTIONS_PATTERNS } from '@app/common/patterns/subscriptions.patterns';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { PriceList } from '@app/common/interfaces/price-list.interface';
import { SubscriptionsServiceAdapter } from './subscriptions.service-adapter';

@Injectable()
export class SubscriptionsService extends SubscriptionsServiceAdapter {
  public constructor(
    @Inject('SUBSCRIPTIONS') private readonly subscriptionsClient: ClientProxy,
  ) {
    super();
  }

  public async getPriceList(): Promise<Observable<PriceList[]> | PriceList[]> {
    return this.subscriptionsClient.send<PriceList[]>(
      SUBSCRIPTIONS_PATTERNS.GET_PRICES(),
      {},
    );
  }
}
