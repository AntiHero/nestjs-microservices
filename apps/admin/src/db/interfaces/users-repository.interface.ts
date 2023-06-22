// import { DeepPartial  } from 'typeorm';
import { DeepPartial } from '@app/common/types/deep-partial.type';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

import { MongoRepository } from './mongo/mongo.repository';
import { UserModel } from '../../app/entity/user.model';

export abstract class UsersRepositoryInterface extends MongoRepository<UserModel> {
  public constructor(@InjectModel(UserModel) repository: ModelType<UserModel>) {
    super(repository);
  }

  public abstract update(
    id: string,
    updates: DeepPartial<UserModel>,
  ): Promise<boolean>;
}
