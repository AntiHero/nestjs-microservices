import { Field, Int, ObjectType } from '@nestjs/graphql';

import { AdminEntity } from 'apps/admin/src/app/entity/admin.entity';

@ObjectType()
export class Admin implements AdminEntity {
  @Field(() => Int)
  public id: number;

  public username: string;

  public email: string;

  public password: string;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}
