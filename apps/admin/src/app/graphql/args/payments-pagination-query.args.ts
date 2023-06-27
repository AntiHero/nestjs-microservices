import { BanFilter, PaymentStatus, UserSortFields } from '@app/common/enums';
import { ArgsType, Field }                          from '@nestjs/graphql';

import { PaginationQuery }                          from './pagination-query.args';

@ArgsType()
export class PaymentsPaginationQuery extends PaginationQuery {
  @Field(() => UserSortFields)
  sortField = 'createdAt';

  @Field(() => BanFilter)
  banFilter: boolean | null = null;

  @Field(() => PaymentStatus)
  status: PaymentStatus = PaymentStatus.CONFIRMED;
}
