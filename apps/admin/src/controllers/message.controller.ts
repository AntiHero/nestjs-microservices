import { ConfirmedEmailtype }          from '@app/common/message-creators/confirmed-email.message-creator';
import { CreatedPostType }             from '@app/common/message-creators/created-post.message-creator';
import { CreatedSubscriptinType }      from '@app/common/message-creators/created-subscription.message-creator';
import { CreatedUserType }             from '@app/common/message-creators/created-user.message-creator';
import { DeletedPostType }             from '@app/common/message-creators/deleted-post.message-creator';
import { UpdatedAvatarType }           from '@app/common/message-creators/updated-avatar.message-creator';
import { UpdatedPostType }             from '@app/common/message-creators/updated-post.message-creator';
import { UpdatedProfileType }          from '@app/common/message-creators/updated-profile.message-creator';
import { SubscriptionEvent }           from '@app/common/patterns';
import { RootEvent }                   from '@app/common/patterns/root.pattern';
import { RmqService }                  from '@app/common/src';
import { NotNullable }                 from '@app/common/types/not-nullable.type';
import { Controller }                  from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { PaymentsRepositoryInterface } from '../db/interfaces/payments/payments-repository.interface';
import { PostsRepositoryInterface }    from '../db/interfaces/post/posts-repository.interface';
import { UsersRepositoryInterface }    from '../db/interfaces/users-repository.interface';

@Controller()
export class AdminMessageConroller {
  public constructor(
    private readonly rmqService: RmqService,
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly postsRepository: PostsRepositoryInterface,
    private readonly paymentsRepository: PaymentsRepositoryInterface,
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
    @Payload() data: CreatedPostType,
    @Ctx() context: RmqContext,
  ) {
    await this.postsRepository.create(data);

    this.rmqService.ack(context);
  }

  @MessagePattern(RootEvent.UpdatedPost)
  public async updatePost(
    @Payload() { id, ...updates }: UpdatedPostType,
    @Ctx() context: RmqContext,
  ) {
    await this.postsRepository.update(id, updates);

    this.rmqService.ack(context);
  }

  @MessagePattern(RootEvent.DeletedPost)
  public async deletePost(
    @Payload() { id }: DeletedPostType,
    @Ctx() context: RmqContext,
  ) {
    await this.postsRepository.delete(id);

    this.rmqService.ack(context);
  }

  @MessagePattern(SubscriptionEvent.SubscriptionCreated)
  public async createSubscription(
    @Payload() payload: NotNullable<CreatedSubscriptinType>,
    @Ctx() context: RmqContext,
  ) {
    await this.paymentsRepository.create(payload);

    this.rmqService.ack(context);
  }
}
