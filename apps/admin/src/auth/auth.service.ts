import { Injectable } from '@nestjs/common';

import { AdminEntity } from '../entity/admin.entity';
import { AbstractRepository } from '../database/abstract.repository';

@Injectable()
export class AuthService {
  public constructor(
    private readonly adminsRepository: AbstractRepository<AdminEntity>,
  ) {}

  public async validate(email: string, password: string) {
    const admin = await this.adminsRepository.getOneByQuery({ email });

    if (!admin || admin.password !== password) return null;

    return admin;
  }
}
