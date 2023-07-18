import { updatedPostMessageCreator }       from '@app/common/message-creators/updated-post.message-creator';
import { RootEvent }                       from '@app/common/patterns/root.pattern';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 as EventEmitter }   from '@nestjs/event-emitter';
import { Post }                            from '@prisma/client';

import { NOTIFY_ADMIN_EVENT }              from 'apps/root/src/common/event-router';
import { UpdatePostDto }                   from 'apps/root/src/user/dto/update-post.dto';
import { PostsRepositoryAdapter }          from 'apps/root/src/user/repositories/adapters/post/posts.adapter';

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

    const message = updatedPostMessageCreator({
      id: postId,
      description: payload.description,
    });

    this.eventEmitter.emit(NOTIFY_ADMIN_EVENT, [
      RootEvent.UpdatedPost,
      message,
    ]);
  }
}
