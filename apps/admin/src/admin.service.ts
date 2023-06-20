import { AdminPatterns } from '@app/common/patterns';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DeepPartial } from 'typeorm';

import { AdminEntity } from './app/entity/admin.entity';
import { UserModel } from './app/entity/user.model';
import { Repository } from './database/abstracts/repository';
import { SqlRepository } from './database/abstracts/sql.repository';

@Injectable()
export class AdminService {
  public constructor(
    private readonly repository: SqlRepository<AdminEntity>,
    private readonly usersRepository: Repository<UserModel>,
    @Inject('ROOT_RMQ') private readonly rootClient: ClientProxy,
  ) {}

  public createAdmin(data: DeepPartial<AdminEntity>) {
    return this.repository.create(data);
  }

  public async deleteUser(id: string) {
    const result = await this.usersRepository.delete(id);

    if (result) {
      this.rootClient.emit(AdminPatterns.DeleteUser, id);
    }

    return result;
  }
}
