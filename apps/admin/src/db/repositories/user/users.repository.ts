import { DatabaseException } from '@app/common/exceptions/database.exception';
import { applyUpdates } from '@app/common/utils/apply-updates.util';
import { Injectable, Provider } from '@nestjs/common';
import { DeepPartial } from 'typeorm';

import { UserModel } from '../../../app/entity/user.model';
import { UsersRepositoryInterface } from '../../interfaces/users-repository.interface';

@Injectable()
export class UsersRepository extends UsersRepositoryInterface {
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







@Injectable()
export class UsersRepository extends UsersRepositoryInterface {
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
