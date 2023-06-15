import { Injectable } from '@nestjs/common';

import { AdminEntity } from '../app/entity/admin.entity';
import { SqlRepository } from './abstracts/sql.repository';

@Injectable()
export class AdminRepository extends SqlRepository<AdminEntity> {
  public constructor() {
    super(AdminEntity);
  }
}
