// import { DeepPartial  } from 'typeorm';
import { DeepPartial } from '@app/common/types/deep-partial.type';

import { MongoRepository } from './mongo/mongo.repository';
import { UserModel } from '../../app/entity/user.model';

export abstract class UsersRepositoryInterface extends MongoRepository<UserModel> {
  public abstract update(
    id: string,
    updates: DeepPartial<UserModel>,
  ): Promise<boolean>;
}
