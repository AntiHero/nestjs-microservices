import { PriceList } from '@app/common/interfaces/price-list.interface';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export abstract class SubscriptionsServiceAdapter {
  public abstract getPriceList(): Promise<
    Observable<PriceList[]> | PriceList[]
  >;
}
