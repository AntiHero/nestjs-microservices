import { Field, ObjectType } from '@nestjs/graphql';

import { UserViewModel } from '../../../utils/user-list-view.mapper';

@ObjectType()
export class UserOutput implements UserViewModel {
  @Field(() => String)
  public userId: string;

  @Field()
  public username: string;

  @Field()
  public profileLink: string;

  @Field(() => Date)
  public dataAdded: Date;
}
