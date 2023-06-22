import { DatabaseException } from '@app/common/exceptions/database.exception';
import { UpdatedAvatarType } from '@app/common/message-creators/updated-avatar.message-creator';
import { UpdatedProfileType } from '@app/common/message-creators/updated-profile.message-creator';
import { applyUpdates } from '@app/common/utils/apply-updates.util';
import { Injectable, Provider } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { DeepPartial } from 'typeorm';

import { UsersRepositoryInterface } from './interfaces/users-repository.interface';
import { UserModel } from '../app/entity/user.model';

@Injectable()
export class UsersRepository extends UsersRepositoryInterface {
  public constructor(@InjectModel(UserModel) repository: ModelType<UserModel>) {
    super(repository);
  }

  // public async confirmEmall(id: string): Promise<boolean> {
  //   try {
  //     const result = await this.repository.updateOne(
  //       {
  //         id,
  //       },
  //       {
  //         isEmailConfirmed: true,
  //       },
  //     );

  //     return result.modifiedCount ? true : false;
  //   } catch (error) {
  //     console.log(error);

  //     throw new DatabaseException();
  //   }
  // }

  // public async updateProfile(
  //   id: string,
  //   updates: Omit<UpdatedProfileType, 'userId'>,
  // ): Promise<boolean> {
  //   try {
  //     const result = await this.repository.findOneAndUpdate(
  //       {
  //         id,
  //       },
  //       {
  //         $set: {
  //           'profile.$': updates,
  //         },
  //       },
  //     );

  //     return !!result;
  //   } catch (error) {
  //     console.log(error);

  //     throw new DatabaseException();
  //   }
  // }

  // public async updateAvatar(
  //   id: string,
  //   updates: Omit<UpdatedAvatarType, 'userId'>,
  // ): Promise<boolean> {
  //   try {
  //     const result = await this.repository.findByIdAndUpdate(
  //       {
  //         id,
  //       },
  //       {
  //         $set: {
  //           'avatar.$': updates,
  //         },
  //       },
  //     );

  //     return !!result;
  //   } catch (error) {
  //     console.log(error);

  //     throw new DatabaseException();
  //   }
  // }

  public async update(
    id: string,
    updates: DeepPartial<UserModel>,
  ): Promise<boolean> {
    try {
      const result = await this.repository.findOne({
        id,
      });

      if (!result) return false;

      await applyUpdates(result, <any>updates).save();

      return true;
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
