import { ModelType } from '@typegoose/typegoose/lib/types';

import { SortDirection } from '@app/common/enums';
import { DatabaseException } from '@app/common/exceptions/database.exception';
import { PaginationQuery } from '../../app/graphql/args/get-userlist.args';

export abstract class MongoQueryRepository<M> {
  public constructor(protected readonly repository: ModelType<M>) {}

  public async getByQuery(paginationQuery: PaginationQuery) {
    try {
      const { page, pageSize, sortDirection, searchUsernameTerm } =
        paginationQuery;

      const result = await this.repository
        .find({
          username: { $regex: searchUsernameTerm },
        })
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .sort({
          createdAt: sortDirection === SortDirection.Asc ? 1 : -1,
        })
        .lean();

      return result;
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }
}
