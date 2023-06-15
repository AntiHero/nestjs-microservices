import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AdminService } from './admin.service';
import { Admin } from './app/graphql/model/admin.model';
import { UserModel } from './app/entity/user.model';
import { BasicAuthGuard } from './@core/guards/basic.guard';
import { MongoRepository } from './database/abstracts/mongo.repository';
import { UserOutput } from './app/graphql/output/user-output.model';
import { Public } from '@app/common/decorators/public.decorator';
import { PaginationQuery } from './app/graphql/input/get-userlist.input';
import { CreateAdminInput } from './app/graphql/input/create-admin.input';
import { toUserViewModel } from './utils/user-list-view.mapper';

@UseGuards(BasicAuthGuard)
@Resolver()
export class AdminResolver {
  public constructor(
    private readonly adminService: AdminService,
    private readonly usersQueryRepository: MongoRepository<UserModel>,
  ) {}

  @Public()
  @Query(() => String)
  public async healthCheck() {
    return 'ok';
  }

  @Query(() => [UserOutput])
  public async getUserList(@Args('input') paginationQuery: PaginationQuery) {
    const result =
      (await this.usersQueryRepository.getByQuery(paginationQuery))?.map(
        toUserViewModel,
      ) || [];

    return result;
  }

  @Mutation(() => Admin)
  async createAdmin(@Args('input') createAdminInput: CreateAdminInput) {
    const result = await this.adminService.createAdmin(createAdminInput);

    return result;
  }
}
