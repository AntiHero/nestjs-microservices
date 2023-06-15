import { ModelType } from '@typegoose/typegoose/lib/types';
import { Injectable, Provider } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';

import { UserModel } from '../app/entity/user.model';
import { Repository } from './abstracts/repository';
import { MongoRepository } from './abstracts/mongo.repository';

@Injectable()
export class UsersRepository extends MongoRepository<UserModel> {
  public constructor(@InjectModel(UserModel) repository: ModelType<UserModel>) {
    super(repository);
  }
}

export const UsersRepositoryProvider: Provider = {
  provide: Repository,
  useClass: UsersRepository,
};
