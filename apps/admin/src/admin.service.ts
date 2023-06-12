import { Injectable } from '@nestjs/common';

import { AdminEntity } from './entity/admin.entity';
import { AbstractRepository } from './database/abstract.repository';
import { DeepPartial } from 'typeorm';

@Injectable()
export class AdminService {
  public constructor(
    private readonly repository: AbstractRepository<AdminEntity>,
  ) {}

  public createAdmin(data: DeepPartial<AdminEntity>) {
    return this.repository.create(data);
  }
}
