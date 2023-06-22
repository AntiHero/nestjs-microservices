import { Injectable, Provider } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

import { PostModel } from 'apps/admin/src/app/entity/post.model';

import { PostsQueryRepositoryInterface } from '../../interfaces/post/posts-query-repository.interface';

@Injectable()
export class PostsQueryRepository extends PostsQueryRepositoryInterface {
  public constructor(@InjectModel(PostModel) repository: ModelType<PostModel>) {
    super(repository);
  }
}

export const PostsQueryRepositoryProvider: Provider = {
  provide: PostsQueryRepositoryInterface,
  useClass: PostsQueryRepository,
};
