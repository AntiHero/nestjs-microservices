import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';

import { Token } from './@core/tokens';
import {
  PostImagesInput,
  toPostImagesViewModel,
} from './utils/post-images-view.mapper';
import { AdminService } from './admin.service';
import { PaymentStatus } from '@app/common/enums';
import { PostModel } from './app/entity/post.model';
import { Admin } from './app/graphql/model/admin.model';
import { BasicAuthGuard } from './@core/guards/basic.guard';
import { UserOutput } from './app/graphql/output/user.output';
import { toUserViewModel } from './utils/user-list-view.mapper';
import { Public } from '@app/common/decorators/public.decorator';
import { PaymentModel } from './app/entity/subscriptions.model';
import { ImageOutput } from './app/graphql/output/avatar.output';
import { toPaymentsViewModel } from './utils/payments-view.mapper';
import { PaymentOutput } from './app/graphql/output/payments.output';
import { toUserInfoViewModel } from './utils/user-info-view.mapper';
import { UserInfoOutput } from './app/graphql/output/user-info.outpul';
import { DeleteUserInput } from './app/graphql/input/delete-user.input';
import { UserPaginationQuery } from './app/graphql/args/pagination-query';
import { CreateAdminInput } from './app/graphql/input/create-admin.input';
import { PaginationQuery } from './app/graphql/args/pagination-query.args';
import { AbstractUsersQueryRepository } from './database/abstracts/users.query-repository';
import { MongoQueryRepository } from './database/abstracts/mongo.query-repository';

@UseGuards(BasicAuthGuard)
@Resolver()
export class AdminResolver {
  public constructor(
    private readonly adminService: AdminService,
    private readonly usersQueryRepository: AbstractUsersQueryRepository,
    @Inject(Token.PostsQueryRepository)
    private readonly postsQueryRepository: MongoQueryRepository<PostModel>,
    @Inject(Token.PaymentsQueryRepository)
    private readonly paymentQueryRepository: MongoQueryRepository<PaymentModel>,
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

  @Query(() => [ImageOutput], { nullable: true, name: 'userPhotos' })
  public async getPostImages(
    @Args('userId', { type: () => ID }) userId: string,
    @Args() paginationQuery: PaginationQuery,
  ) {
    const result = await this.postsQueryRepository.findByQuery(
      {
        userId,
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

  @Query(() => [PaymentOutput], { name: 'payments', nullable: true })
  public async getPayments(
    @Args('userId', { type: () => ID }) userId: string,
    @Args() paginationQuery: PaginationQuery,
  ) {
    const result = await this.paymentQueryRepository.findByQuery(
      {
        userId,
        status: PaymentStatus.CONFIRMED,
      },
      {},
      paginationQuery,
    );

    return result.map(toPaymentsViewModel);
  }
}
