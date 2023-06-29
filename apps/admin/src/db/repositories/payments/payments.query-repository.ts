import { SortDirection }                    from '@app/common/enums';
import { DatabaseException }                from '@app/common/exceptions/database.exception';
import { Injectable, Provider }             from '@nestjs/common';
import { ModelType }                        from '@typegoose/typegoose/lib/types';
import { InjectModel }                      from 'nestjs-typegoose';

import { PaymentClass }                     from 'apps/admin/src/app/entity/payments.model';
import { PaymentsPaginationQuery }          from 'apps/admin/src/app/graphql/args/payments-with-user-details-pagination-query.args';
import { PaginationResult }                 from 'apps/admin/src/interfaces/pagination-result.interface';
import { PaymentWithUserDetails }           from 'apps/admin/src/interfaces/payment-with-user-details.interface';

import { PaymentsQueryRepositoryInterface } from '../../interfaces/payments/payments-query-repository.interface';

@Injectable()
export class PaymentsQueryRepository extends PaymentsQueryRepositoryInterface {
  public constructor(
    @InjectModel(PaymentClass) repository: ModelType<PaymentClass>,
  ) {
    super(repository);
  }

  public async getPaymentsInfoWithUserDetails(
    query: PaymentsPaginationQuery,
  ): Promise<PaginationResult<PaymentWithUserDetails>> {
    const {
      status,
      page,
      pageSize,
      sortDirection,
      sortField,
      searchUsernameTerm,
    } = query;

    try {
      const result = await this.repository.aggregate([
        {
          $match: {
            status,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: 'id',
            as: 'users',
          },
        },
        {
          $unwind: '$users',
        },
        {
          $addFields: {
            username: '$users.username',
            userId: '$users.userId',
            photo: '$users.avatar.url',
          },
        },
        {
          $project: {
            _id: 0,
            id: 1,
            provider: 1,
            type: 1,
            createdAt: 1,
            photo: 1,
            username: 1,
            currency: 1,
            price: 1,
          },
        },
        {
          $match: {
            username: {
              $regex: searchUsernameTerm,
            },
          },
        },
        {
          $facet: {
            data: [
              {
                $sort: {
                  [sortField]: sortDirection === SortDirection.Asc ? 1 : -1,
                },
              },
              {
                $skip: (page - 1) * pageSize,
              },
              {
                $limit: pageSize,
              },
            ],
            totalCount: [
              {
                $count: 'count',
              },
            ],
          },
        },
        {
          $project: {
            data: 1,
            totalCount: { $arrayElemAt: ['$totalCount.count', 0] },
          },
        },
      ]);

      return result[0];
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }
}

export const PaymentsQueryRepositoryProvider: Provider = {
  provide: PaymentsQueryRepositoryInterface,
  useClass: PaymentsQueryRepository,
};
