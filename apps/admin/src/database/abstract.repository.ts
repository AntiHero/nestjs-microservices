import { DataSource, DeepPartial, EntityTarget, Repository } from 'typeorm';
import { Inject } from '@nestjs/common';

import { BaseEntity } from '../entity/base';
import { DatabaseException } from '@app/common/exceptions/database.exception';

export abstract class AbstractRepository<
  K extends BaseEntity,
  T = new () => any,
> {
  @Inject(DataSource)
  private dataSource: DataSource;

  protected repository: Repository<K>;

  public async onModuleInit() {
    this.repository = this.dataSource.getRepository(
      this.entity as unknown as EntityTarget<K>,
    );
  }

  public constructor(private readonly entity: T) {}

  public async create(data: DeepPartial<K>): Promise<any> {
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
}
