import { Injectable, Provider } from '@nestjs/common';

import { UsersQueryRepositoryInterface } from '../../interfaces/users-query-repository.interface';

@Injectable()
export class UsersQueryRepository extends UsersQueryRepositoryInterface {}

export const UsersQueryRepositoryProvider: Provider = {
  provide: UsersQueryRepositoryInterface,
  useClass: UsersQueryRepository,
};



@Injectable()
export class UsersQueryRepository extends UsersQueryRepositoryInterface {}

export const UsersQueryRepositoryProvider: Provider = {
  provide: UsersQueryRepositoryInterface,
  useClass: UsersQueryRepository,
};
