import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

import { PaymentModel } from 'apps/admin/src/app/entity/subscriptions.model';

import { MongoQueryRepository } from '../mongo/mongo-query-repository.interface';

export abstract class PaymentsQueryRepositoryInterface extends MongoQueryRepository<PaymentModel> {
  public constructor(
    @InjectModel(PaymentModel) repository: ModelType<PaymentModel>,
  ) {
    super(repository);
  }
}
