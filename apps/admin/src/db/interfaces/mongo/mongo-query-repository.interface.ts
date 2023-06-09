import { SortDirection }     from '@app/common/enums';
import { DatabaseException } from '@app/common/exceptions/database.exception';
import { ModelType }         from '@typegoose/typegoose/lib/types';

import { PaginationQuery }   from 'apps/admin/src/app/graphql/args/pagination-query.args';

export abstract class MongoQueryRepository<M> {
  public constructor(protected readonly repository: ModelType<M>) {}

  public async findByQuery(
    filter: Partial<M>,
    selection: any,
    paginationQuery: PaginationQuery,
  ) {
    try {
      const { page, pageSize, sortDirection } = paginationQuery;

      const totalCount = await this.repository.count(filter);

      const result = await this.repository
        .find(filter)
        .select(selection)
        .sort({
          createdAt: sortDirection === SortDirection.Asc ? 1 : -1,
        })
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .lean();

      return { data: result, totalCount };
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }
}
