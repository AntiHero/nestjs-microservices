import { UpdatedProfileType } from '@app/common/message-creators/updated-profile.message-creator';

import { UserModel } from '../../app/entity/user.model';
import { MongoRepository } from '../mongo.repository';

export abstract class UsersRepositoryInterface extends MongoRepository<UserModel> {
  public abstract confirmEmall(id: string): Promise<boolean>;

  public abstract updateProfile(
    id: string,
    updates: Omit<UpdatedProfileType, 'userId'>,
  ): Promise<boolean>;
}
