import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationOutput }  from './pagination.output';
import { UserPaymentOutput } from '../user-payments.output';

@ObjectType()
export class UserPaymentsPaginationOutput extends PaginationOutput<UserPaymentOutput> {
  @Field(() => [UserPaymentOutput])
  public data: UserPaymentOutput[];
}
