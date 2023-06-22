import { ModelType }       from '@typegoose/typegoose/lib/types';
import { InjectModel }     from 'nestjs-typegoose';

import { MongoRepository } from './mongo/mongo.repository';
import { UserModel }       from '../../app/entity/user.model';

export abstract class UsersRepositoryInterface extends MongoRepository<UserModel> {
  public constructor(@InjectModel(UserModel) repository: ModelType<UserModel>) {
    super(repository);
  }
}
