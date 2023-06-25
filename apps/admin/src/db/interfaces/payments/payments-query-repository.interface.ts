import { ModelType }            from '@typegoose/typegoose/lib/types';
import { InjectModel }          from 'nestjs-typegoose';

import { PaymentClass }         from 'apps/admin/src/app/entity/payments.model';

import { MongoQueryRepository } from '../mongo/mongo-query-repository.interface';

export abstract class PaymentsQueryRepositoryInterface extends MongoQueryRepository<PaymentClass> {
  public constructor(
    @InjectModel(PaymentClass) repository: ModelType<PaymentClass>,
  ) {
    super(repository);
  }
}
