import { BanSearchStatus, SortDirection } from '@app/common/enums';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(SortDirection, {
  name: 'SortDirectionType',
  description: '[asc, desc]',
});

registerEnumType(BanSearchStatus, {
  name: 'BanSearchStatusType',
  description: '[all, active, banned]',
});

// registerEnumType(SortByForUsersInputType, {
//   name: 'SortByForUsers',
//   description: 'Sort By [id, userName, createdAt]',
// });
