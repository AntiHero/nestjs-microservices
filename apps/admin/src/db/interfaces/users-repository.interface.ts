import { DeepPartial } from 'typeorm';

import { UserModel } from '../../app/entity/user.model';
import { MongoRepository } from '../mongo.repository';

export abstract class UsersRepositoryInterface extends MongoRepository<UserModel> {
  // public abstract confirmEmall(id: string): Promise<boolean>;

  // public abstract updateProfile(
  //   id: string,
  //   updates: Omit<UpdatedProfileType, 'userId'>,
  // ): Promise<boolean>;

  // public abstract updateAvatar(
  //   id: string,
  //   updates: Omit<UpdatedAvatarType, 'userId'>,
  // ): Promise<boolean>;

  public abstract update(
    id: string,
    updates: DeepPartial<UserModel>,
  ): Promise<boolean>;
}
