import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { RootServiceAdapter } from './root.service-adapter';
import { ROOT_PATTERNS } from '@app/common/patterns/root.patterns';
import { GetUserInfoResult } from '@app/common/interfaces/get-user-info-result.interface';

@Injectable()
export class RootService extends RootServiceAdapter {
  public constructor(@Inject('ROOT') private readonly rootClient: ClientProxy) {
    super();
  }
  public getUserInfo(userId: string): Observable<GetUserInfoResult | null> {
    return this.rootClient.send(ROOT_PATTERNS.GET_USER_INFO(), {
      userId,
    });
  }
}
