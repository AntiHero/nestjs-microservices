import { ModelType } from '@typegoose/typegoose/lib/types';
import { Injectable, Provider } from '@nestjs/common';

import { InjectModel } from 'nestjs-typegoose';
import { MongoQueryRepository } from './abstracts/mongo.query-repository';
import { UserModel } from '../app/entity/user.model';

@Injectable()
export class UsersQueryRepository extends MongoQueryRepository<UserModel> {
  public constructor(@InjectModel(UserModel) repository: ModelType<UserModel>) {
    super(repository);
  }
}

export const UsersQueryRepositoryProvider: Provider = {
  provide: MongoQueryRepository,
  useClass: UsersQueryRepository,
};
