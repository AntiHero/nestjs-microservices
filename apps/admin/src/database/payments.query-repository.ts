import { Injectable, Provider } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

import { MongoQueryRepository } from './interfaces/mongo-repository.interface';
import { Token } from '../@core/tokens';
import { PaymentModel } from '../app/entity/subscriptions.model';

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
