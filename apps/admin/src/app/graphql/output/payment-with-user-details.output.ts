import { Currency, PaymentProvider, SubscriptionType } from '@app/common/enums';
import { Field, ID, ObjectType }                       from '@nestjs/graphql';

@ObjectType()
export class PaymentWithUserDetailsOutput {
  @Field(() => ID)
  public id: string;

  @Field()
  public username: string;

  @Field()
  public amount: number;

  @Field(() => Currency)
  public currency: Currency;

  @Field()
  public dateAdded: string;

  @Field(() => String, { nullable: true })
  public photo: string | null;

  @Field(() => PaymentProvider)
  public paymentType: PaymentProvider;

  @Field(() => SubscriptionType)
  public subscriptionType: SubscriptionType;
}
