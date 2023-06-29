import { GetUserInfoResult }   from '@app/common/interfaces/get-user-info-result.interface';
import { AdminCommand }        from '@app/common/patterns';
import { SubscriptionCommand } from '@app/common/patterns/subscriptions.pattern';
import { RmqService }          from '@app/common/src';
import { Controller }          from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AccountPlan }         from '@prisma/client';

import { UserRepository }      from '../user/repositories/user.repository';

@Controller()
export class TcpController {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern(SubscriptionCommand.GetUserInfo)
  public async getUserInfo({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserInfoResult | null> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) return null;

    return { username: user.username, email: user.email };
  }

  @MessagePattern(SubscriptionCommand.UpdateUserAccountPlan)
  public async updateUserAccountPlan(
    @Payload() data: { userId: string; plan: AccountPlan },
    @Ctx() context: RmqContext,
  ) {
    const { userId, plan } = data;

    await this.userRepository.update(userId, { accountPlan: plan });
    this.rmqService.ack(context);
  }

  @MessagePattern(AdminCommand.DeleteUser)
  public async deleteUser(
    @Payload() userId: string,
    @Ctx() context: RmqContext,
  ) {
    await this.userRepository.delete(userId);

    this.rmqService.ack(context);
  }

  @MessagePattern(AdminCommand.BanUser)
  public async banUser(@Payload() userId: string, @Ctx() context: RmqContext) {
    await this.userRepository.update(userId, {
      isBanned: true,
    });

    this.rmqService.ack(context);
  }
}
