import { Public }                              from '@app/common/decorators/public.decorator';
import { PaymentStatus }                       from '@app/common/enums';
import { UseGuards }                           from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { BasicAuthGuard }                      from './@core/guards/basic.guard';
import { AdminService }                        from './admin.service';
import { PaginationQuery }                     from './app/graphql/args/pagination-query.args';
import { PaymentsPaginationQuery }             from './app/graphql/args/payments-pagination-query.args';
import { UserPaginationQuery }                 from './app/graphql/args/user-pagination-query';
import { BanUserInput }                        from './app/graphql/input/ban-user-input';
import { CreateAdminInput }                    from './app/graphql/input/create-admin.input';
import { DeleteUserInput }                     from './app/graphql/input/delete-user.input';
import { Admin }                               from './app/graphql/model/admin.model';
import { ImageOutput }                         from './app/graphql/output/avatar.output';
import { PaymentOutput }                       from './app/graphql/output/payment.output';
import { UserInfoOutput }                      from './app/graphql/output/user-info.outpul';
import { UserPaymentsOutput }                  from './app/graphql/output/user-payments.output';
import { UserOutput }                          from './app/graphql/output/user.output';
import { PaymentsQueryRepositoryInterface }    from './db/interfaces/payments/payments-query-repository.interface';
import { PostsQueryRepositoryInterface }       from './db/interfaces/post/posts-query-repository.interface';
import { UsersQueryRepositoryInterface }       from './db/interfaces/users-query-repository.interface';
import {
  PostImagesInput,
  toPostImagesViewModel,
} from './utils/post-images-view.mapper';
import { toUserInfoViewModel }                 from './utils/user-info-view.mapper';
import { toUserViewModel }                     from './utils/user-list-view.mapper';
import { toUserPaymentsViewModel }             from './utils/user-payments-view.mapper';

@UseGuards(BasicAuthGuard)
@Resolver()
export class AdminResolver {
  public constructor(
    private readonly adminService: AdminService,
    private readonly usersQueryRepository: UsersQueryRepositoryInterface,
    private readonly postsQueryRepository: PostsQueryRepositoryInterface,
    private readonly paymentQueryRepository: PaymentsQueryRepositoryInterface,
  ) {}

  @Public()
  @Query(() => String)
  public async healthCheck() {
    return 'ok';
  }

  @Query(() => [UserOutput], { name: 'userList' })
  public async getUserList(@Args() paginationQuery: UserPaginationQuery) {
    const result =
      (await this.usersQueryRepository.getList(paginationQuery))?.map(
        toUserViewModel,
      ) || [];

    return result;
  }

  @Mutation(() => Boolean)
  public async deleteUser(@Args('input') input: DeleteUserInput) {
    return this.adminService.deleteUser(input.id);
  }

  @Mutation(() => Boolean)
  public async banUser(@Args('input') input: BanUserInput) {
    return this.adminService.banUser(input.id, input.banReason);
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

  @Query(() => [UserPaymentsOutput], { name: 'userPayments', nullable: true })
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

    return result.map(toUserPaymentsViewModel);
  }

  @Mutation(() => Boolean)
  public async unBanUser(@Args('input') input: BanUserInput) {
    return this.adminService.unBanUser(input.id);
  }

  @Query(() => [PaymentOutput], { name: 'allUsersPayments' })
  public async getAllUsersPayments(
    @Args() paymentsPaginationQuery: PaymentsPaginationQuery,
  ) {
    const result =
      await this.paymentQueryRepository.getPaymentsInfoWithUserDetails(
        paymentsPaginationQuery,
      );

    return [];
  }
}
