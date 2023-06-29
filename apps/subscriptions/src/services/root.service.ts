import { GetUserInfoResult }            from '@app/common/interfaces/get-user-info-result.interface';
import { SubscriptionCommand }          from '@app/common/patterns/subscriptions.pattern';
import { ClientToken }                  from '@app/common/tokens';
import { Inject, Injectable, Provider } from '@nestjs/common';
import { ClientProxy }                  from '@nestjs/microservices';
import { Observable }                   from 'rxjs';

import { RootServiceInterface }         from './root.service.interface';

@Injectable()
export class RootService extends RootServiceInterface {
  public constructor(
    @Inject(ClientToken.ROOT) private readonly rootClient: ClientProxy,
  ) {
    super();
  }

  public getUserInfo(userId: string): Observable<GetUserInfoResult | null> {
    return this.rootClient.send(SubscriptionCommand.GetUserInfo, {
      userId,
    });
  }
}

export const RootServiceProvider: Provider = {
  provide: RootServiceInterface,
  useClass: RootService,
};
