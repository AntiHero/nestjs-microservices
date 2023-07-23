import { DatabaseException } from '@app/common/exceptions/database.exception';
import { DeepPartial }       from '@app/common/types/deep-partial.type';
import { applyUpdates }      from '@app/common/utils/apply-updates.util';
import { ModelType }         from '@typegoose/typegoose/lib/types';

import { Repository }        from '../repository.interface';

export abstract class MongoRepository<M> extends Repository<M> {
  public constructor(protected readonly repository: ModelType<M>) {
    super();
  }

  public async deleteByQuery(query: Partial<M>) {
    try {
      const result = await this.repository.deleteMany(query);

      return result.deletedCount ? true : false;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  public async delete(id: string): Promise<string | null> {
    try {
      const result = await this.repository.deleteOne({
        id,
      });

      return result.deletedCount ? id : null;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async create(data: Partial<M>) {
    try {
      const result = await this.repository.create(data);

      return result;
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }

  public async update(
    id: string,
    updates: DeepPartial<M>,
  ): Promise<string | null> {
    try {
      const result = await this.repository.findOne({
        id,
      });

      if (!result) return null;

      await applyUpdates(result, <any>updates).save();

      return id;
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }
}
