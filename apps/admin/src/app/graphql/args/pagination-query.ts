import { BanSearchStatus, SortDirection } from '@app/common/enums';
import { ArgsType, registerEnumType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { Field } from '@nestjs/graphql';

import { PaginationQuery } from './pagination-query.args';

registerEnumType(SortDirection, {
  name: 'SortDirectionType',
  description: '[asc, desc]',
});

registerEnumType(BanSearchStatus, {
  name: 'BanSearchStatusType',
  description: '[all, active, banned]',
});

@ArgsType()
export class UserPaginationQuery extends PaginationQuery {
  @Field(() => String)
  @Transform(({ value }) => {
    return value ? new RegExp(value, 'i') : /.*/;
  })
  searchUsernameTerm = '';
}
