import { AdminCommand }                from '@app/common/patterns';
import { RmqClientToken }              from '@app/common/tokens';
import { Inject, Injectable }          from '@nestjs/common';
import { ClientProxy }                 from '@nestjs/microservices';
import { DeepPartial }                 from 'typeorm';

import { AdminEntity }                 from './app/entity/admin.entity';
import { PaymentsRepositoryInterface } from './db/interfaces/payments/payments-repository.interface';
import { PostsRepositoryInterface }    from './db/interfaces/post/posts-repository.interface';
import { SqlRepository }               from './db/interfaces/sql-repository.interface';
import { UsersRepositoryInterface }    from './db/interfaces/users-repository.interface';

@Injectable()
export class AdminService {
  public constructor(
    private readonly repository: SqlRepository<AdminEntity>,
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly postsRepository: PostsRepositoryInterface,
    private readonly paymentsRepository: PaymentsRepositoryInterface,
    @Inject(RmqClientToken.ROOT_RMQ) private readonly rootClient: ClientProxy,
  ) {}

  public createAdmin(data: DeepPartial<AdminEntity>) {
    return this.repository.create(data);
  }

  public async deleteUser(id: string) {
    const [result] = await Promise.all([
      this.usersRepository.delete(id),
      this.postsRepository.deleteByQuery({
        userId: id,
      }),
      this.paymentsRepository.deleteByQuery({ userId: id }),
    ]);

    if (result) {
      this.rootClient.emit(AdminCommand.DeleteUser, id);
    }

    return result;
  }

  public async banUser(id: string, banReason: string) {
    const result = await this.usersRepository.update(id, {
      isBanned: true,
      banReason,
    });

    if (result) {
      this.rootClient.emit(AdminCommand.BanUser, id);
    }

    return result;
  }

  public async unBanUser(id: string) {
    const result = await this.usersRepository.update(id, {
      isBanned: false,
      banReason: '',
    });

    if (result) {
      this.rootClient.emit(AdminCommand.BanUser, id);
    }

    return result;
  }
}
