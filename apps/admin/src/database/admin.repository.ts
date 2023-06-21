import { Injectable } from '@nestjs/common';

import { SqlRepository } from './interfaces/sql-repository.interface';
import { AdminEntity } from '../app/entity/admin.entity';

@Injectable()
export class AdminRepository extends SqlRepository<AdminEntity> {
  public constructor() {
    super(AdminEntity);
  }
}
