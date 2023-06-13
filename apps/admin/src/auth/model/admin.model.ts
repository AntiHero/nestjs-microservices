import { Field, Int, ObjectType } from '@nestjs/graphql';

import { AdminEntity } from 'apps/admin/src/entity/admin.entity';

@ObjectType()
export class Admin implements AdminEntity {
  @Field(() => Int)
  public id: number;

  @Field()
  public username: string;

  @Field()
  public email: string;

  @Field()
  public password: string;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}
