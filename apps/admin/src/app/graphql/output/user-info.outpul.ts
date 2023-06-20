import { Field, ID, ObjectType } from '@nestjs/graphql';

import { UserInfoViewModel } from 'apps/admin/src/utils/user-info-view.mapper';
import { ImageOutput } from './avatar.output';

@ObjectType()
export class UserInfoOutput implements UserInfoViewModel {
  @Field(() => ID)
  public userId: string;

  @Field()
  public username: string;

  @Field()
  public profileLink: string;

  @Field()
  public dateAdded: string;

  @Field(() => ImageOutput)
  public avatar: ImageOutput;
}
