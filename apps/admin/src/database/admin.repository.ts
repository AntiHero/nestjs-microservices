import { Injectable } from '@nestjs/common';
import { AdminEntity } from '../entity/admin.entity';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export class AdminRepository extends AbstractRepository<AdminEntity> {
  public constructor() {
    super(AdminEntity);
  }
}
