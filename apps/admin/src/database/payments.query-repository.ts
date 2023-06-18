import { ModelType } from '@typegoose/typegoose/lib/types';
import { Injectable, Provider } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';

import { Token } from '../@core/tokens';
import { PaymentModel } from '../app/entity/subscriptions.model';
import { MongoQueryRepository } from './abstracts/mongo.query-repository';

@Injectable()
export class PaymentsQueryRepository extends MongoQueryRepository<PaymentModel> {
  public constructor(
    @InjectModel(PaymentModel) repository: ModelType<PaymentModel>,
  ) {
    super(repository);
  }
}

export const PaymentsQueryRepositoryProvider: Provider = {
  provide: Token.PaymentsQueryRepository,
  useClass: PaymentsQueryRepository,
};
