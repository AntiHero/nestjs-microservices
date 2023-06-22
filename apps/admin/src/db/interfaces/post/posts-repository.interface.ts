import { ModelType }       from '@typegoose/typegoose/lib/types';
import { InjectModel }     from 'nestjs-typegoose';

import { PostModel }       from 'apps/admin/src/app/entity/post.model';

import { MongoRepository } from '../mongo/mongo.repository';

export abstract class PostsRepositoryInterface extends MongoRepository<PostModel> {
  public constructor(@InjectModel(PostModel) repository: ModelType<PostModel>) {
    super(repository);
  }
}
