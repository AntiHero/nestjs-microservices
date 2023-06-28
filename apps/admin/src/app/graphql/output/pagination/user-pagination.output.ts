import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationOutput }  from './pagination.output';
import { UserOutput }        from '../user.output';

@ObjectType()
export class UserPaginationOutput extends PaginationOutput<UserOutput> {
  @Field(() => [UserOutput])
  public data: UserOutput[];
}
