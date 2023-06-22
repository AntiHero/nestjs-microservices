import { AdminCommand } from '@app/common/patterns';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DeepPartial } from 'typeorm';

import { AdminEntity } from './app/entity/admin.entity';
import { SqlRepository } from './db/interfaces/sql-repository.interface';
import { UsersRepositoryInterface } from './db/interfaces/users-repository.interface';

@Injectable()
export class AdminService {
  public constructor(
    private readonly repository: SqlRepository<AdminEntity>,
    private readonly usersRepository: UsersRepositoryInterface,
    @Inject('ROOT_RMQ') private readonly rootClient: ClientProxy,
  ) {}

  public createAdmin(data: DeepPartial<AdminEntity>) {
    return this.repository.create(data);
  }

  public async deleteUser(id: string) {
    const result = await this.usersRepository.delete(id);

    if (result) {
      this.rootClient.emit(AdminCommand.DeleteUser, id);
    }

    return result;
  }
}
