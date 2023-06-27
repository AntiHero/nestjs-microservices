import { ModelType }       from '@typegoose/typegoose/lib/types';
import { InjectModel }     from 'nestjs-typegoose';

import { PaymentClass }    from 'apps/admin/src/app/entity/payments.model';

import { MongoRepository } from '../mongo/mongo.repository';

export abstract class PaymentsRepositoryInterface extends MongoRepository<PaymentClass> {
  public constructor(
    @InjectModel(PaymentClass) repository: ModelType<PaymentClass>,
  ) {
    super(repository);
  }
}
