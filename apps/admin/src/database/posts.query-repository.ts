import { ModelType } from '@typegoose/typegoose/lib/types';
import { Injectable, Provider } from '@nestjs/common';

import { InjectModel } from 'nestjs-typegoose';
import { PostModel } from '../app/entity/post.model';
import { MongoQueryRepository } from './abstracts/mongo.query-repository';

@Injectable()
export class PostsQueryRepository extends MongoQueryRepository<PostModel> {
  public constructor(@InjectModel(PostModel) repository: ModelType<PostModel>) {
    super(repository);
  }
}

export const PostsQueryRepositoryProvider: Provider = {
  provide: MongoQueryRepository,
  useClass: PostsQueryRepository,
};
