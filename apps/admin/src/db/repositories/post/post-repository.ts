import { Injectable, Provider } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

import { PostModel } from 'apps/admin/src/app/entity/post.model';

import { PostsRepositoryInterface } from '../../interfaces/post/posts-repository.interface';

@Injectable()
export class PostsRepository extends PostsRepositoryInterface {
  public constructor(@InjectModel(PostModel) repository: ModelType<PostModel>) {
    super(repository);
  }
}

export const PostsRepositoryProvider: Provider = {
  provide: PostsRepositoryInterface,
  useClass: PostsRepository,
};
