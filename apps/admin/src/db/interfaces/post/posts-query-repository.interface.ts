import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

import { PostClass } from '../../../app/entity/post.model';
import { MongoQueryRepository } from '../mongo/mongo-query-repository.interface';

export abstract class PostsQueryRepositoryInterface extends MongoQueryRepository<PostClass> {
  public constructor(@InjectModel(PostClass) repository: ModelType<PostClass>) {
    super(repository);
  }
}
