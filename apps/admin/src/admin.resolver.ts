import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { Admin } from './auth/model/admin.model';
import { CreateAdminInput } from './auth/input/create-admin.input';
import { AdminService } from './admin.service';

@Resolver()
export class AdminResolver {
  public constructor(private readonly adminService: AdminService) {}

  @Query(() => String)
  public healthCheck() {
    return 'ok';
  }

  @Mutation(() => Admin)
  async createAdmin(@Args('input') createAdminInput: CreateAdminInput) {
    console.log(createAdminInput);

    const result = await this.adminService.createAdmin(createAdminInput);
    // return this.postsService.createPost(createPostInput, context.req.user);
    return result;
  }
}
