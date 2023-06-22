import { Injectable, Provider }     from '@nestjs/common';

import { UsersRepositoryInterface } from '../../interfaces/users-repository.interface';

@Injectable()
export class UsersRepository extends UsersRepositoryInterface {}

export const UsersRepositoryProvider: Provider = {
  provide: UsersRepositoryInterface,
  useClass: UsersRepository,
};
