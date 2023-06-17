import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AdminService } from './admin.service';
import { PostModel } from './app/entity/post.model';
import { Admin } from './app/graphql/model/admin.model';
import { BasicAuthGuard } from './@core/guards/basic.guard';
import { UserOutput } from './app/graphql/output/user.output';
import { toUserViewModel } from './utils/user-list-view.mapper';
import { Public } from '@app/common/decorators/public.decorator';
import { toUserInfoViewModel } from './utils/user-info-view.mapper';
import { UserInfoOutput } from './app/graphql/output/user-info.outpul';
import { DeleteUserInput } from './app/graphql/input/delete-user.input';
import { UserPaginationQuery } from './app/graphql/args/pagination-query';
import { CreateAdminInput } from './app/graphql/input/create-admin.input';
import { AbstractUsersQueryRepository } from './database/abstracts/users.query-repository';
import { MongoQueryRepository } from './database/abstracts/mongo.query-repository';
import { PaginationQuery } from './app/graphql/args/pagination-query.args';
import {
  PostImagesInput,
  toPostImagesViewModel,
} from './utils/post-images-view.mapper';
import { AvatarOutput } from './app/graphql/output/avatar.output';

@UseGuards(BasicAuthGuard)
@Resolver()
export class AdminResolver {
  public constructor(
    private readonly adminService: AdminService,
    private readonly usersQueryRepository: AbstractUsersQueryRepository,
    private readonly postsQueryRepository: MongoQueryRepository<PostModel>,
  ) {}

  @Public()
  @Query(() => String)
  public async healthCheck() {
    return 'ok';
  }

  @Query(() => [UserOutput], { name: 'userList' })
  public async getUserList(@Args() paginationQuery: UserPaginationQuery) {
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

    return result && toUserInfoViewModel(result);
  }

  @Query(() => [AvatarOutput], { nullable: true, name: 'userPhotos' })
  public async getPostImages(
    @Args('id', { type: () => ID }) id: string,
    @Args() paginationQuery: PaginationQuery,
  ) {
    const result = await this.postsQueryRepository.findByQuery(
      {
        userId: id,
      },
      {
        images: {
          url: 1,
          previewUrl: 1,
        },
      },
      paginationQuery,
    );

    return (result as unknown as PostImagesInput[])
      .map(toPostImagesViewModel)
      .flat();
  }
}
