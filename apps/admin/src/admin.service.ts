import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';

import { AdminEntity } from './entity/admin.entity';
import { AbstractRepository } from './database/abstract.repository';

@Injectable()
export class AdminService {
  public constructor(
    private readonly repository: AbstractRepository<AdminEntity>,
  ) {}

  public createAdmin(data: DeepPartial<AdminEntity>) {
    console.log;
    return this.repository.create(data);
  }
}
