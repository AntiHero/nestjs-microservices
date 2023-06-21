import { Field, InputType } from '@nestjs/graphql';
import { IsEmail }          from 'class-validator';

import { AdminEntity }      from '../../entity/admin.entity';

@InputType()
export class CreateAdminInput
  implements Pick<AdminEntity, 'email' | 'username' | 'password'>
{
  @Field()
  @IsEmail()
  public email: string;

  @Field()
  public username: string;

  @Field()
  public password: string;
}
