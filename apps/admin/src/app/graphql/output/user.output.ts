import { Field, ID, ObjectType } from '@nestjs/graphql';

import { UserViewModel } from 'apps/admin/src/utils/user-list-view.mapper';

@ObjectType()
export class UserOutput implements UserViewModel {
  @Field(() => ID)
  public id: string;

  @Field()
  public username: string;

  @Field()
  public profileLink: string;

  @Field()
  public dateAdded: string;
}
