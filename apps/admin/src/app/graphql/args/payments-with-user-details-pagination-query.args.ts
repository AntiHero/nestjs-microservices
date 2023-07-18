import { PaymentStatus }                     from '@app/common/enums';
import { PaymentsSortFields }                from '@app/common/enums/payments-sort-fields.enum';
import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';
import { Transform }                         from 'class-transformer';

import { PaginationQuery }                   from './pagination-query.args';

registerEnumType(PaymentsSortFields, {
  name: 'PaymentsSortFields',
  description: `${Object.keys(PaymentsSortFields)}`,
});

@ArgsType()
export class PaymentsPaginationQuery extends PaginationQuery {
  @Field(() => PaymentsSortFields)
  sortField = 'createdAt';

  @Field(() => PaymentStatus)
  status?: PaymentStatus = PaymentStatus.CONFIRMED;

  @Field(() => String)
  @Transform(({ value }) => {
    return value ? new RegExp(value, 'i') : /.*/;
  })
  searchUsernameTerm = '';
}
