import { MongoRepository } from './mongo/mongo.repository';
import { UserClass }       from '../../app/entity/user.model';

export abstract class UsersRepositoryInterface extends MongoRepository<UserClass> {}
