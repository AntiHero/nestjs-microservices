import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Post } from '@prisma/client';
import { UpdatePostDto } from 'apps/root/src/user/dto/update-post.dto';

import { PostsRepositoryAdapter } from 'apps/root/src/user/repositories/adapters/post/posts.adapter';

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
  ) {}

  public async execute(command: UpdatePostCommand): Promise<void> {
    const { userId, postId, payload } = command;

    await this.postsRepository.updatePost(userId, postId, payload);
  }
}
