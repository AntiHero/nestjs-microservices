import { Field, ObjectType }            from '@nestjs/graphql';

import { PaginationOutput }             from './pagination.output';
import { PaymentWithUserDetailsOutput } from '../payment-with-user-details.output';

@ObjectType()
export class PaymentsWithUserDetailsPaginationOutput extends PaginationOutput<PaymentWithUserDetailsOutput> {
  @Field(() => [PaymentWithUserDetailsOutput])
  public data: PaymentWithUserDetailsOutput[];
}
