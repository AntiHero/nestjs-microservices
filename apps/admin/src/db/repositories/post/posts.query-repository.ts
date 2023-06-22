import { Injectable, Provider } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

import { Token } from 'apps/admin/src/@core/tokens';
import { PostModel } from 'apps/admin/src/app/entity/post.model';

import { MongoQueryRepository } from '../../interfaces/mongo-repository.interface';

@Injectable()
export class PostsQueryRepository extends MongoQueryRepository<PostModel> {
  public constructor(@InjectModel(PostModel) repository: ModelType<PostModel>) {
    super(repository);
  }
}

export const PostsQueryRepositoryProvider: Provider = {
  provide: Token.PostsQueryRepository,
  useClass: PostsQueryRepository,
};
