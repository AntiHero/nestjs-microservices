import { DatabaseException } from '@app/common/exceptions/database.exception';
import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';

import { Repository } from './interfaces/repository.interface';

@Injectable()
export class MongoRepository<M> extends Repository<M> {
  public constructor(protected readonly repository: ModelType<M>) {
    super();
  }

  public async delete(id: string) {
    try {
      const result = await this.repository.updateOne(
        {
          id,
        },
        {
          isDeleted: true,
        },
      );

      return result.modifiedCount ? true : false;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  public async create(data: Partial<M>) {
    try {
      const result = await this.repository.create(data);

      console.log(result);

      return result;
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }
}
