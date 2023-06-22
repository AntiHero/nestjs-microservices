import { ConfirmedEmailtype } from '@app/common/message-creators/confirmed-email.message-creator';
import { CreatedPostType } from '@app/common/message-creators/created-post.message-creator';
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

import { PostsRepositoryInterface } from '../db/interfaces/post/posts-repository.interface';
import { UsersRepositoryInterface } from '../db/interfaces/users-repository.interface';

@Controller()
export class AdminMessageConroller {
  public constructor(
    private readonly rmqService: RmqService,
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly postsRepository: PostsRepositoryInterface,
  ) {}

  @MessagePattern(RootEvent.CreatedUser)
  public async createUser(
    @Payload() data: CreatedUserType,
    @Ctx() context: RmqContext,
  ) {
    await this.usersRepository.create(data);

    this.rmqService.ack(context);
  }

  @MessagePattern(RootEvent.ConfirmedEmail)
  public async confirmEmail(
    @Payload() { userId, ...updates }: ConfirmedEmailtype,
    @Ctx() context: RmqContext,
  ) {
    await this.usersRepository.update(userId, updates);

    this.rmqService.ack(context);
  }

  @MessagePattern(RootEvent.UpdatedProfile)
  public async updateProfile(
    @Payload() { userId, ...updates }: UpdatedProfileType,
    @Ctx() context: RmqContext,
  ) {
    await this.usersRepository.update(userId, { profile: { ...updates } });

    this.rmqService.ack(context);
  }

  @MessagePattern(RootEvent.UpdatedAvatar)
  public async updateAvatar(
    @Payload() { userId, ...updates }: UpdatedAvatarType,
    @Ctx() context: RmqContext,
  ) {
    await this.usersRepository.update(userId, { avatar: { ...updates } });

    this.rmqService.ack(context);
  }

  @MessagePattern(RootEvent.CreatedPost)
  public async createPost(
    @Payload() { userId, ...updates }: CreatedPostType,
    @Ctx() context: RmqContext,
  ) {
    // await this.usersRepository.update(userId, { avatar: { ...updates } });
    await this.postsRepository;

    this.rmqService.ack(context);
  }
}
