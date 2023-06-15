import { ModelType } from '@typegoose/typegoose/lib/types';
import { Injectable, Provider } from '@nestjs/common';

import { InjectModel } from 'nestjs-typegoose';
import { MongoRepository } from './abstracts/mongo.repository';
import { UserModel } from '../app/entity/user.model';

@Injectable()
export class UsersQueryRepository extends MongoRepository<UserModel> {
  public constructor(@InjectModel(UserModel) repository: ModelType<UserModel>) {
    super(repository);
  }
}

export const UsersQueryRepositoryProvider: Provider = {
  provide: MongoRepository,
  useClass: UsersQueryRepository,
};
