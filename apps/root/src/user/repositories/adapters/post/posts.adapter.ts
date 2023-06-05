import { RepositoryAdapter } from 'apps/root/src/common/adapters/repository.adapter';
import { UpdatePostDto } from 'apps/root/src/user/dto/update-post.dto';

export abstract class PostsRepositoryAdapter<T> extends RepositoryAdapter {
  public abstract deletePost(userId: string, postId: string): Promise<void>;

  public abstract updatePost(
    userId: string,
    postId: string,
    payload: UpdatePostDto,
  ): Promise<any>;
}
