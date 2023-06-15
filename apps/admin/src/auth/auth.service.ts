import { Injectable } from '@nestjs/common';

import { AdminEntity } from '../app/entity/admin.entity';
import { SqlRepository } from '../database/abstracts/sql.repository';

@Injectable()
export class AuthService {
  public constructor(
    private readonly adminsRepository: SqlRepository<AdminEntity>,
  ) {}

  public async validate(email: string, password: string) {
    const admin = await this.adminsRepository.getOneByQuery({ email });

    if (!admin || admin.password !== password) return null;

    return admin;
  }
}
