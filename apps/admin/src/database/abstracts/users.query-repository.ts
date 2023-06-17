import { UserModel } from '../../app/entity/user.model';
import { MongoQueryRepository } from './mongo.query-repository';

export abstract class AbstractUsersQueryRepository extends MongoQueryRepository<UserModel> {
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
    } catch (error) {}
  }
}
