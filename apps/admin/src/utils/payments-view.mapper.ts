import { PaymentViewModel }  from '../@core/interfaces';
import { type PaymentClass } from '../app/entity/payments.model';

export const toPaymentsViewModel = (input: PaymentClass): PaymentViewModel => ({
  currency: input.currency,
  endDate: input.endDate,
  price: input.price,
  provider: input.provider,
  startDate: input.startDate,
  type: input.type,
});
