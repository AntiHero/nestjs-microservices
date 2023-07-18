import { PaymentClass }            from 'apps/admin/src/app/entity/payments.model';
import { PaymentsPaginationQuery } from 'apps/admin/src/app/graphql/args/payments-with-user-details-pagination-query.args';
import { PaginationResult }        from 'apps/admin/src/interfaces/pagination-result.interface';
import { PaymentWithUserDetails }  from 'apps/admin/src/interfaces/payment-with-user-details.interface';

import { MongoQueryRepository }    from '../mongo/mongo-query-repository.interface';

export abstract class PaymentsQueryRepositoryInterface extends MongoQueryRepository<PaymentClass> {
  public abstract getPaymentsInfoWithUserDetails(
    query: PaymentsPaginationQuery,
  ): Promise<PaginationResult<PaymentWithUserDetails>>;
}
