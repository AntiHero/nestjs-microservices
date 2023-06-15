import { ModelType } from '@typegoose/typegoose/lib/types';
import { PaginationQuery } from '../../app/graphql/input/get-userlist.input';

export abstract class MongoRepository<M> {
  public constructor(private readonly repository: ModelType<M>) {}

  public async getByQuery(paginationQuery: PaginationQuery) {
    const { page, pageSize } = paginationQuery;
    const result = await this.repository
      .find()
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort({
        createdAt: 1,
      })
      .lean();

    return result;
  }
}
