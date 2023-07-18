import { UserPaymentViewModel } from '../@core/interfaces';
import { type PaymentClass }    from '../app/entity/payments.model';

export const toPaymentsViewModel = (
  input: PaymentClass,
): UserPaymentViewModel => ({
  currency: input.currency,
  endDate: input.endDate,
  price: input.price,
  paymentType: input.provider,
  startDate: input.startDate,
  subscriptionType: input.type,
});
