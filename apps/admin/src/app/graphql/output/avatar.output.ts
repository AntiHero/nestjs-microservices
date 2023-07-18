import { Field, ObjectType }                 from '@nestjs/graphql';

import { AvatarViewModel as ImageViewModel } from 'apps/admin/src/utils/common.interfaces';

@ObjectType()
export class ImageOutput implements ImageViewModel {
  @Field(() => String, { nullable: true })
  public url: string | null;

  @Field(() => String, { nullable: true })
  public previewUrl: string | null;
}
