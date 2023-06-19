import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Post } from '@prisma/client';

import { PostsRepositoryAdapter } from 'apps/root/src/user/repositories/adapters/post/posts.adapter';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { NOTIFY_ADMIN_EVENT } from 'apps/root/src/common/services/event-handler.service';
import { RootEvents } from '@app/common/patterns/root.patterns';
import { deletedPostMessageCreator } from '@app/common/message-creators/deleted-post.message-creator';

export class DeletePostCommand {
  public constructor(
    public readonly userId: string,
    public readonly postId: string,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  public constructor(
    private readonly postsRepository: PostsRepositoryAdapter<Post>,
    private readonly eventEmitter: EventEmitter,
  ) {}

  public async execute(command: DeletePostCommand): Promise<void> {
    const { userId, postId } = command;

    await this.postsRepository.deletePost(userId, postId);

    const message = deletedPostMessageCreator(postId);

    this.eventEmitter.emit(NOTIFY_ADMIN_EVENT, [
      RootEvents.DeletedPost,
      message,
    ]);
  }
}
