import { ModelType } from '@typegoose/typegoose/lib/types';
import { Injectable, Provider } from '@nestjs/common';

import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from '../app/entity/user.model';
import { MongoQueryRepository } from './abstracts/mongo.query-repository';
import { AbstractUsersQueryRepository } from './abstracts/users.query-repository';

@Injectable()
export class UsersQueryRepository extends AbstractUsersQueryRepository {
  public constructor(@InjectModel(UserModel) repository: ModelType<UserModel>) {
    super(repository);
  }
}

export const UsersQueryRepositoryProvider: Provider = {
  provide: AbstractUsersQueryRepository,
  useClass: UsersQueryRepository,
};
