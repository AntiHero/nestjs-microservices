import {}                    from '@app/common/enums';
import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationResult }  from 'apps/admin/src/interfaces/pagination-result.interface';

@ObjectType()
export abstract class PaginationOutput<T> implements PaginationResult<T> {
  public data: T[];

  @Field()
  public totalCount: number;
}
