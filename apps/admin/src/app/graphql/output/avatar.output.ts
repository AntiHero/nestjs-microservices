import { Field, ObjectType } from '@nestjs/graphql';
import { AvatarViewModel } from 'apps/admin/src/utils/common.interfaces';

@ObjectType()
export class AvatarOutput implements AvatarViewModel {
  @Field(() => String, { nullable: true })
  public url: string | null;

  @Field(() => String, { nullable: true })
  public previewUrl: string | null;
}
