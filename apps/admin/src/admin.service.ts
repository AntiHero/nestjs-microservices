import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';

import { AdminEntity } from './app/entity/admin.entity';
import { SqlRepository } from './database/abstracts/sql.repository';

@Injectable()
export class AdminService {
  public constructor(private readonly repository: SqlRepository<AdminEntity>) {}

  public createAdmin(data: DeepPartial<AdminEntity>) {
    console.log;
    return this.repository.create(data);
  }
}
