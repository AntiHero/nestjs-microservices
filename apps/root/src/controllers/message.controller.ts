import { AccountPlan } from '@prisma/client';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { RmqService } from '@app/common/src';
import { ROOT_PATTERNS } from '@app/common/patterns/root.patterns';
import { UserRepository } from '../user/repositories/user.repository';
import { GetUserInfoResult } from '@app/common/interfaces/get-user-info-result.interface';

@Controller()
export class TcpController {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern(ROOT_PATTERNS.GET_USER_INFO())
  public async getUserInfo({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserInfoResult | null> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) return null;

    return { username: user.username, email: user.email };
  }

  @MessagePattern('msg_from_root')
  public async updateUserAccountPlan(
    @Payload() data: { userId: string; plan: AccountPlan },
    @Ctx() context: RmqContext,
  ) {
    const { userId } = data;

    await this.userRepository.updateAccountPlan(userId, AccountPlan.BUSINESS);
    this.rmqService.ack(context);
  }
}
