import { Field, InputType } from '@nestjs/graphql';

import { DeleteUserInput }  from './delete-user.input';

@InputType()
export class BanUserInput extends DeleteUserInput {
  @Field({ defaultValue: 'Another Reason', nullable: true })
  public banReason: string;
}
