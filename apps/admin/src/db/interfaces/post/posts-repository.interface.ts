import { ModelType }       from '@typegoose/typegoose/lib/types';
import { InjectModel }     from 'nestjs-typegoose';

import { PostClass }       from 'apps/admin/src/app/entity/post.model';

import { MongoRepository } from '../mongo/mongo.repository';

export abstract class PostsRepositoryInterface extends MongoRepository<PostClass> {
  public constructor(@InjectModel(PostClass) repository: ModelType<PostClass>) {
    super(repository);
  }
}
