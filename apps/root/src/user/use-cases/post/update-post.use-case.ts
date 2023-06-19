import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Post } from '@prisma/client';
import { UpdatePostDto } from 'apps/root/src/user/dto/update-post.dto';

import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { PostsRepositoryAdapter } from 'apps/root/src/user/repositories/adapters/post/posts.adapter';
import { updatedPostMessageCreator } from '@app/common/message-creators/updated-post.message-creator';
import { NOTIFY_ADMIN_EVENT } from 'apps/root/src/common/services/event-handler.service';
import { RootEvents } from '@app/common/patterns/root.patterns';

export class UpdatePostCommand {
  public constructor(
    public readonly userId: string,
    public readonly postId: string,
    public readonly payload: UpdatePostDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  public constructor(
    private readonly postsRepository: PostsRepositoryAdapter<Post>,
    private readonly eventEmitter: EventEmitter,
  ) {}

  public async execute(command: UpdatePostCommand): Promise<void> {
    const { userId, postId, payload } = command;

    await this.postsRepository.updatePost(userId, postId, payload);

    const message = updatedPostMessageCreator(postId, payload.description);

    this.eventEmitter.emit(NOTIFY_ADMIN_EVENT, [
      RootEvents.UpdatedPost,
      message,
    ]);
  }
}
