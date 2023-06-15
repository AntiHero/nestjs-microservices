import { Inject } from '@nestjs/common';
import {
  DataSource,
  DeepPartial,
  EntityTarget,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { BaseEntity } from '../../app/entity/base';
import { DatabaseException } from '@app/common/exceptions/database.exception';

export abstract class SqlRepository<K extends BaseEntity, T = new () => any> {
  @Inject(DataSource)
  private dataSource: DataSource;

  protected repository: Repository<K>;

  private async onModuleInit() {
    this.repository = this.dataSource.getRepository(
      this.entity as unknown as EntityTarget<K>,
    );
  }

  public constructor(private readonly entity: T) {}

  public async create(data: DeepPartial<K>): Promise<K> {
    try {
      const result = (await this.repository.save(
        data,
      )) as unknown as Promise<K>;

      return result;
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }

  public async getOneByQuery(data: DeepPartial<K>): Promise<K | null> {
    try {
      const result = await this.repository.findOne({
        where: data as unknown as FindOptionsWhere<K>,
      });

      return result;
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }
}
