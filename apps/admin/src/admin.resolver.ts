import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AdminService } from './admin.service';
import { UserModel } from './app/entity/user.model';
import { Admin } from './app/graphql/model/admin.model';
import { BasicAuthGuard } from './@core/guards/basic.guard';
import { Public } from '@app/common/decorators/public.decorator';
import { toUserViewModel } from './utils/user-list-view.mapper';
import { UserOutput } from './app/graphql/output/user-output.model';
import { PaginationQuery } from './app/graphql/args/get-userlist.args';
import { CreateAdminInput } from './app/graphql/input/create-admin.input';
import { DeleteUserInput } from './app/graphql/input/delete-user.input';
import { MongoQueryRepository } from './database/abstracts/mongo.query-repository';

@UseGuards(BasicAuthGuard)
@Resolver()
export class AdminResolver {
  public constructor(
    private readonly adminService: AdminService,
    private readonly usersQueryRepository: MongoQueryRepository<UserModel>,
  ) {}

  @Public()
  @Query(() => String)
  public async healthCheck() {
    return 'ok';
  }

  @Query(() => [UserOutput])
  public async getUserList(@Args() paginationQuery: PaginationQuery) {
    const result =
      (await this.usersQueryRepository.getByQuery(paginationQuery))?.map(
        toUserViewModel,
      ) || [];

    return result;
  }

  @Mutation(() => Boolean)
  public async deleteUser(@Args('input') input: DeleteUserInput) {
    return this.adminService.deleteUser(input.id);
  }

  @Mutation(() => Admin)
  async createAdmin(@Args('input') createAdminInput: CreateAdminInput) {
    const result = await this.adminService.createAdmin(createAdminInput);

    return result;
  }
}
