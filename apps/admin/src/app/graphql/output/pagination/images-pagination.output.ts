import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationOutput }  from './pagination.output';
import { ImageOutput }       from '../avatar.output';

@ObjectType()
export class ImagesPaginationOutput extends PaginationOutput<ImageOutput> {
  @Field(() => [ImageOutput])
  public data: ImageOutput[];
}
