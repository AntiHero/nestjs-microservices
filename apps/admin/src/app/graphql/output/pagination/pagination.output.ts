import {}                   from '@app/common/enums';
import { Field }            from '@nestjs/graphql';

import { PaginationResult } from 'apps/admin/src/interfaces/pagination-result.interface';

export abstract class PaginationOutput<T> implements PaginationResult<T> {
  public data: T[];

  @Field()
  public totalCount: number;
}
