import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AdminService } from './admin.service';
import { Admin } from './auth/model/admin.model';
import { BasicAuthGuard } from './@core/guards/local.guard';
import { CreateAdminInput } from './auth/input/create-admin.input';

@UseGuards(BasicAuthGuard)
@Resolver()
export class AdminResolver {
  public constructor(private readonly adminService: AdminService) {}

  @Query(() => String)
  public healthCheck() {
    return 'ok';
  }

  @Mutation(() => Admin)
  async createAdmin(@Args('input') createAdminInput: CreateAdminInput) {
    const result = await this.adminService.createAdmin(createAdminInput);

    return result;
  }
}
