import { Field, InputType } from '@nestjs/graphql';

import { DeleteUserInput }  from './delete-user.input';

@InputType()
export class BanUserInput extends DeleteUserInput {
  @Field()
  public banReason: string;
}
