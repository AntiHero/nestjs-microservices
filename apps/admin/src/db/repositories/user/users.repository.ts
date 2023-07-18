import { Injectable, Provider }     from '@nestjs/common';
import { ModelType }                from '@typegoose/typegoose/lib/types';
import { InjectModel }              from 'nestjs-typegoose';

import { UserClass }                from 'apps/admin/src/app/entity/user.model';

import { UsersRepositoryInterface } from '../../interfaces/users-repository.interface';

@Injectable()
export class UsersRepository extends UsersRepositoryInterface {
  public constructor(@InjectModel(UserClass) repository: ModelType<UserClass>) {
    super(repository);
  }
}

export const UsersRepositoryProvider: Provider = {
  provide: UsersRepositoryInterface,
  useClass: UsersRepository,
};
