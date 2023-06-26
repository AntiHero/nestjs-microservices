import { DatabaseException }       from '@app/common/exceptions/database.exception';
import { ModelType }               from '@typegoose/typegoose/lib/types';
import { InjectModel }             from 'nestjs-typegoose';

import { PaymentClass }            from 'apps/admin/src/app/entity/payments.model';
import { PaymentsPaginationQuery } from 'apps/admin/src/app/graphql/args/payments-pagination-query.args';

import { MongoQueryRepository }    from '../mongo/mongo-query-repository.interface';

export abstract class PaymentsQueryRepositoryInterface extends MongoQueryRepository<PaymentClass> {
  public constructor(
    @InjectModel(PaymentClass) repository: ModelType<PaymentClass>,
  ) {
    super(repository);
  }

  public async getPaymentsInfoWithUserDetails(query: PaymentsPaginationQuery) {
    const {} = query;

    try {
      const result = await this.repository.aggregate([
        // {
        //   $match: {
        //     status: ,
        //   },
        // },
        // {
        //   $lookup: {
        //     from: 'posts',
        //     localField: 'id',
        //     foreignField: 'userId',
        //     as: 'posts',
        //   },
        // },
        // {
        //   $project: {
        //     _id: 0,
        //     id: 1,
        //     avatar: {
        //       url: 1,
        //       previewUrl: 1,
        //     },
        //     createdAt: 1,
        //     username: 1,
        //     totalImageCount: {
        //       $sum: {
        //         $map: {
        //           input: '$posts.images',
        //           as: 'image',
        //           in: { $size: '$$image' },
        //         },
        //       },
        //     },
        //   },
        // },
      ]);
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }
}
