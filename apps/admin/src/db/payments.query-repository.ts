import { Injectable, Provider } from '@nestjs/common';

import { PaymentsQueryRepositoryInterface } from './interfaces/payments/payments-query-repository.interface';

@Injectable()
export class PaymentsQueryRepository extends PaymentsQueryRepositoryInterface {}

export const PaymentsQueryRepositoryProvider: Provider = {
  provide: PaymentsQueryRepositoryInterface,
  useClass: PaymentsQueryRepository,
};
