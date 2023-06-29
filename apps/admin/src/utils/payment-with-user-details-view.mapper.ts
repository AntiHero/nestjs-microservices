import { PaymentWithUserDetailsOutput } from '../app/graphql/output/payment-with-user-details.output';
import { PaymentWithUserDetails }       from '../interfaces/payment-with-user-details.interface';

export const toPaymentWithUserDetailsViewModel = (
  input: PaymentWithUserDetails,
): PaymentWithUserDetailsOutput => ({
  currency: input.currency,
  amount: input.price,
  dateAdded: input.createdAt.toISOString(),
  subscriptionType: input.type,
  id: input.id,
  paymentType: input.provider,
  photo: input.photo || null,
  username: input.username,
});
