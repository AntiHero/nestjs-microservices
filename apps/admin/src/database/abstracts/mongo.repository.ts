import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';

import { Repository } from './repository';

@Injectable()
export class MongoRepository<M> extends Repository<M> {
  public constructor(private readonly repository: ModelType<M>) {
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
}
