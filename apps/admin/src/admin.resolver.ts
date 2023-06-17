import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AdminService } from './admin.service';
import { Admin } from './app/graphql/model/admin.model';
import { BasicAuthGuard } from './@core/guards/basic.guard';
import { Public } from '@app/common/decorators/public.decorator';
import { toUserViewModel } from './utils/user-list-view.mapper';
import { UserOutput } from './app/graphql/output/user.output';
import { PaginationQuery } from './app/graphql/args/get-userlist.args';
import { CreateAdminInput } from './app/graphql/input/create-admin.input';
import { DeleteUserInput } from './app/graphql/input/delete-user.input';
import { AbstractUsersQueryRepository } from './database/abstracts/users.query-repository';
import { UserInfoOutput } from './app/graphql/output/user-info.outpul';
import { toUserInfoViewModel } from './utils/user-info-view.mapper';

@UseGuards(BasicAuthGuard)
@Resolver()
export class AdminResolver {
  public constructor(
    private readonly adminService: AdminService,
    private readonly usersQueryRepository: AbstractUsersQueryRepository,
  ) {}

  @Public()
  @Query(() => String)
  public async healthCheck() {
    return 'ok';
  }

  @Query(() => [UserOutput], { name: 'userList' })
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

  @Query(() => UserInfoOutput, { name: 'userInfo' })
  public async getUserInfo(@Args('id', { type: () => ID }) id: string) {
    const result = await this.usersQueryRepository.getInfoById(id);

    console.log(result && toUserInfoViewModel(result));
    return result && toUserInfoViewModel(result);
  }
}
