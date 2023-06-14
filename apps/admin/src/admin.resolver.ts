import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AdminService } from './admin.service';
import { Admin } from './auth/model/admin.model';
import { BasicAuthGuard } from './@core/guards/basic.guard';
import { CreateAdminInput } from './auth/input/create-admin.input';
import { Public } from '@app/common/decorators/public.decorator';

@UseGuards(BasicAuthGuard)
@Resolver()
export class AdminResolver {
  public constructor(private readonly adminService: AdminService) {}

  @Public()
  @Query(() => String)
  public healthCheck() {
    return 'ok';
  }

  @Query()
  public getUserList() {}

  @Mutation(() => Admin)
  async createAdmin(@Args('input') createAdminInput: CreateAdminInput) {
    const result = await this.adminService.createAdmin(createAdminInput);

    return result;
  }
}
