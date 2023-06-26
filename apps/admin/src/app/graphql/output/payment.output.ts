import { Currency, PaymentProvider, SubscriptionType } from '@app/common/enums';
import { Field, ID, ObjectType }                       from '@nestjs/graphql';

@ObjectType()
export class PaymentOutput {
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

  @Field()
  public photo: string;

  @Field(() => PaymentProvider)
  public paymentType: PaymentProvider;

  @Field(() => SubscriptionType)
  public subscriptionType: SubscriptionType;
}
