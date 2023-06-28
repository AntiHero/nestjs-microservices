import { BanFilter, SortDirection, UserSortFields } from '@app/common/enums';
import { DatabaseException }                        from '@app/common/exceptions/database.exception';
import { ModelType }                                from '@typegoose/typegoose/lib/types';
import { InjectModel }                              from 'nestjs-typegoose';

import { MongoQueryRepository }                     from './mongo/mongo-query-repository.interface';
import { UserClass }                                from '../../app/entity/user.model';
import { UserPaginationQuery }                      from '../../app/graphql/args/user-pagination-query';
import { PaginationResult }                         from '../../interfaces/pagination-result.interface';

export abstract class UsersQueryRepositoryInterface extends MongoQueryRepository<UserClass> {
  public constructor(@InjectModel(UserClass) repository: ModelType<UserClass>) {
    super(repository);
  }

  public async getList(
    paginationQuery: UserPaginationQuery,
  ): Promise<PaginationResult<UserClass>> {
    try {
      const { page, pageSize, searchUsernameTerm, sortField, banFilter } =
        paginationQuery;

      const sortDirection =
        paginationQuery.sortDirection === SortDirection.Asc ? 1 : -1;

      const filter = {
        username: { $regex: searchUsernameTerm },
        ...(banFilter === BanFilter.Active
          ? {
              isBanned: false,
            }
          : banFilter === BanFilter.Banned
          ? {
              isBanned: true,
            }
          : {}),
      };

      const totalCount = await this.repository.count(filter);

      const result = await this.repository
        .find(filter)
        .sort(
          sortField === UserSortFields.DateAdded
            ? { createdAt: sortDirection }
            : { username: sortDirection },
        )
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .lean();

      return { data: result, totalCount };
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }

  public async getInfoById(id: string) {
    try {
      const result = await this.repository
        .findOne(
          {
            id,
          },
          {
            _id: 0,
            id: 1,
            createdAt: 1,
            avatar: {
              url: 1,
              previewUrl: 1,
            },
            username: 1,
            banReason: 1,
            isBanned: 1,
          },
        )
        .lean();

      return result;
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }
}
