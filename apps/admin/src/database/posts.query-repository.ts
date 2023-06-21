import { Injectable, Provider } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

import { MongoQueryRepository } from './interfaces/mongo-repository.interface';
import { Token } from '../@core/tokens';
import { PostModel } from '../app/entity/post.model';

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
