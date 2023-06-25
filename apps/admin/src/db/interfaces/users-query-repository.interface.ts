import { SortDirection, UserSortFields } from '@app/common/enums';
import { DatabaseException } from '@app/common/exceptions/database.exception';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

import { MongoQueryRepository } from './mongo/mongo-query-repository.interface';
import { UserClass } from '../../app/entity/user.model';
import { UserPaginationQuery } from '../../app/graphql/args/pagination-query';

export abstract class UsersQueryRepositoryInterface extends MongoQueryRepository<UserClass> {
  public constructor(@InjectModel(UserClass) repository: ModelType<UserClass>) {
    super(repository);
  }

  public async getByQuery(paginationQuery: UserPaginationQuery) {
    try {
      const { page, pageSize, searchUsernameTerm, sortField } = paginationQuery;

      const sortDirection =
        paginationQuery.sortDirection === SortDirection.Asc ? 1 : -1;

      const result = await this.repository
        .find({
          username: { $regex: searchUsernameTerm },
        })
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .sort(
          sortField === UserSortFields.DateAdded
            ? { createdAt: sortDirection }
            : { username: sortDirection },
        )
        .lean();

      return result;
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }

  public async getInfoById(id: string) {
    try {
      // const result = await this.repository.aggregate([
      //   {
      //     $match: {
      //       id,
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: 'posts',
      //       localField: 'id',
      //       foreignField: 'userId',
      //       as: 'posts',
      //     },
      //   },
      //   {
      //     $project: {
      //       _id: 0,
      //       id: 1,
      //       avatar: {
      //         url: 1,
      //         previewUrl: 1,
      //       },
      //       createdAt: 1,
      //       username: 1,
      //       totalImageCount: {
      //         $sum: {
      //           $map: {
      //             input: '$posts.images',
      //             as: 'image',
      //             in: { $size: '$$image' },
      //           },
      //         },
      //       },
      //     },
      //   },
      // ]);
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
