import { PaymentViewModel } from '../@core/interfaces';
import { type PaymentModel } from '../app/entity/subscriptions.model';

export const toPaymentsViewModel = (input: PaymentModel): PaymentViewModel => ({
  currency: input.currency,
  endDate: input.endDate,
  price: input.price,
  provider: input.provider,
  startDate: input.startDate,
  type: input.type,
});
