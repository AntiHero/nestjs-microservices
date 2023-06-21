import { DatabaseException }        from '@app/common/exceptions/database.exception';
import { UpdatedProfileType }       from '@app/common/message-creators/updated-profile.message-creator';
import { Injectable, Provider }     from '@nestjs/common';
import { ModelType }                from '@typegoose/typegoose/lib/types';
import { InjectModel }              from 'nestjs-typegoose';

import { UsersRepositoryInterface } from './interfaces/users-repository.interface';
import { UserModel }                from '../app/entity/user.model';

@Injectable()
export class UsersRepository extends UsersRepositoryInterface {
  public constructor(@InjectModel(UserModel) repository: ModelType<UserModel>) {
    super(repository);
  }

  public async confirmEmall(id: string): Promise<boolean> {
    try {
      const result = await this.repository.updateOne(
        {
          id,
        },
        {
          isEmailConfirmed: true,
        },
      );

      return result.modifiedCount ? true : false;
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }

  public async updateProfile(
    id: string,
    updates: Omit<UpdatedProfileType, 'userId'>,
  ): Promise<boolean> {
    try {
      const result = await this.repository.findOneAndUpdate(
        {
          id,
        },
        {
          $set: {
            'profile.$': updates,
          },
        },
      );

      return !!result;
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }
}

export const UsersRepositoryProvider: Provider = {
  provide: UsersRepositoryInterface,
  useClass: UsersRepository,
};
