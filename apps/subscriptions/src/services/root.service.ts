import { GetUserInfoResult } from '@app/common/interfaces/get-user-info-result.interface';
import { SubscriptionCommand } from '@app/common/patterns/subscriptions.pattern';
import { Inject, Injectable, Provider } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { RootServiceAdapter } from './root.service-adapter';

@Injectable()
export class RootService extends RootServiceAdapter {
  public constructor(@Inject('ROOT') private readonly rootClient: ClientProxy) {
    super();
  }
  public getUserInfo(userId: string): Observable<GetUserInfoResult | null> {
    return this.rootClient.send(SubscriptionCommand.GetUserInfo, {
      userId,
    });
  }
}

export const RootServiceProvider: Provider = {
  provide: RootServiceAdapter,
  useClass: RootService,
};
