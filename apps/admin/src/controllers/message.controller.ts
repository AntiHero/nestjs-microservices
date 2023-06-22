import { ConfirmedEmailtype } from '@app/common/message-creators/confirmed-email.message-creator';
import { CreatedUserType } from '@app/common/message-creators/created-user.message-creator';
import { UpdatedAvatarType } from '@app/common/message-creators/updated-avatar.message-creator';
import { UpdatedProfileType } from '@app/common/message-creators/updated-profile.message-creator';
import { RootEvent } from '@app/common/patterns/root.pattern';
import { RmqService } from '@app/common/src';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { UsersRepositoryInterface } from '../database/interfaces/users-repository.interface';

@Controller()
export class AdminMessageConroller {
  public constructor(
    private readonly rmqService: RmqService,
    private readonly userRepository: UsersRepositoryInterface,
  ) {}

  @MessagePattern(RootEvent.CreatedUser)
  public async createUser(
    @Payload() data: CreatedUserType,
    @Ctx() context: RmqContext,
  ) {
    await this.userRepository.create(data);

    this.rmqService.ack(context);
  }

  @MessagePattern(RootEvent.ConfirmedEmail)
  public async confirmEmail(
    @Payload() { userId, ...updates }: ConfirmedEmailtype,
    @Ctx() context: RmqContext,
  ) {
    await this.userRepository.update(userId, updates);

    this.rmqService.ack(context);
  }

  @MessagePattern(RootEvent.UpdatedProfile)
  public async updateProfile(
    @Payload() { userId, ...updates }: UpdatedProfileType,
    @Ctx() context: RmqContext,
  ) {
    await this.userRepository.update(userId, { profile: { ...updates } });

    this.rmqService.ack(context);
  }

  @MessagePattern(RootEvent.UpdatedAvatar)
  public async updateAvatar(
    @Payload() { userId, ...updates }: UpdatedAvatarType,
    @Ctx() context: RmqContext,
  ) {
    await this.userRepository.update(userId, { avatar: { ...updates } });

    this.rmqService.ack(context);
  }
}
