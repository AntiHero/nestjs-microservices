import { Field, ID, ObjectType } from '@nestjs/graphql';

import {
  AvatarViewModel,
  UserInfoViewModel,
} from 'apps/admin/src/utils/user-info-view.mapper';

@ObjectType()
export class AvatarView implements AvatarViewModel {
  @Field(() => String, { nullable: true })
  public url: string | null;

  @Field(() => String, { nullable: true })
  public previewUrl: string | null;
}

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

  @Field(() => AvatarView)
  public avatar: AvatarView;
}
