import { ModelType }            from '@typegoose/typegoose/lib/types';
import { InjectModel }          from 'nestjs-typegoose';

import { PostModel }            from '../../../app/entity/post.model';
import { MongoQueryRepository } from '../mongo/mongo-query-repository.interface';

export abstract class PostsQueryRepositoryInterface extends MongoQueryRepository<PostModel> {
  public constructor(@InjectModel(PostModel) repository: ModelType<PostModel>) {
    super(repository);
  }
}
