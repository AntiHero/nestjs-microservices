import { DatabaseException } from '@app/common/exceptions/database.exception';
import { DeepPartial }       from '@app/common/types/deep-partial.type';
import { applyUpdates }      from '@app/common/utils/apply-updates.util';
import { ModelType }         from '@typegoose/typegoose/lib/types';

import { Repository }        from '../repository.interface';

export abstract class MongoRepository<M> extends Repository<M> {
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

  public async update(id: string, updates: DeepPartial<M>): Promise<boolean> {
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
