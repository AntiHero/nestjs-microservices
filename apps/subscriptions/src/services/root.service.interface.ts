import { GetUserInfoResult } from '@app/common/interfaces/get-user-info-result.interface';
import { Injectable }        from '@nestjs/common';
import { Observable }        from 'rxjs';

@Injectable()
export abstract class RootServiceInterface {
  public abstract getUserInfo(
    userId: string,
  ): Observable<GetUserInfoResult | null>;
}
