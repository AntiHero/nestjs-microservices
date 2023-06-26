import {
  BanSearchStatus,
  SortDirection,
  UserSortFields,
} from '@app/common/enums';
import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';
import { Transform }                         from 'class-transformer';

import { PaginationQuery }                   from './pagination-query.args';

registerEnumType(SortDirection, {
  name: 'SortDirectionType',
  description: `${Object.keys(SortDirection)}`,
});

registerEnumType(BanSearchStatus, {
  name: 'BanSearchStatusType',
  description: `${Object.keys(BanSearchStatus)}`,
});

registerEnumType(UserSortFields, {
  name: 'UserSortFields',
  description: `${Object.keys(UserSortFields)}`,
});

@ArgsType()
export class UserPaginationQuery extends PaginationQuery {
  @Field(() => String)
  @Transform(({ value }) => {
    return value ? new RegExp(value, 'i') : /.*/;
  })
  searchUsernameTerm = '';

  @Field(() => UserSortFields)
  sortField = 'createdAt';
}
