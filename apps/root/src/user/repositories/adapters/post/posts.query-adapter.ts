import { Injectable } from '@nestjs/common';

import type { UserPost, UserPosts } from 'apps/root/src/user/types';
import { PostsQueryDto } from 'apps/root/src/user/dto/posts-query.dto';

@Injectable()
export abstract class PostsQueryRepositoryAdatapter {
  public abstract getPostsByQuery(
    userId: string,
    postsQuery: PostsQueryDto,
  ): Promise<[number, UserPosts[]]>;

  public abstract getPostById(
    userId: string,
    postId: string,
  ): Promise<UserPost | null>;
}
