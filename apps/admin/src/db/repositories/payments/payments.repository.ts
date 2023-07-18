import { Injectable, Provider }        from '@nestjs/common';

import { PaymentsRepositoryInterface } from '../../interfaces/payments/payments-repository.interface';

@Injectable()
export class PaymentsRepository extends PaymentsRepositoryInterface {}

export const PaymentsRepositoryProvider: Provider = {
  provide: PaymentsRepositoryInterface,
  useClass: PaymentsRepository,
};
