import { Injectable, Provider } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

import { AbstractUsersQueryRepository } from './interfaces/users-query-repository.interface';
import { UserModel } from '../app/entity/user.model';

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
