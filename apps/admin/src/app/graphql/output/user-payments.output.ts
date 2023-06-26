import {
  Currency,
  PaymentProvider,
  PaymentStatus,
  SubscriptionType,
} from '@app/common/enums';
import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';

import { PaymentViewModel }                           from 'apps/admin/src/@core/interfaces';

registerEnumType(Currency, {
  name: 'Currency',
  description: `${Object.keys(Currency)}`,
});

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: `${Object.keys(PaymentStatus)}`,
});

registerEnumType(SubscriptionType, {
  name: 'SubscriptionType',
  description: `${Object.keys(SubscriptionType)}`,
});

registerEnumType(PaymentProvider, {
  name: 'PaymentProvider',
  description: `${Object.keys(PaymentProvider)}`,
});

@ObjectType()
export class UserPaymentsOutput implements PaymentViewModel {
  @Field(() => SubscriptionType)
  public type: SubscriptionType;

  @Field()
  public startDate: Date;

  @Field()
  public endDate: Date;

  @Field(() => Currency)
  public currency: Currency;

  @Field(() => Float)
  public price: number;

  @Field(() => PaymentProvider)
  public paymentType: PaymentProvider;

  @Field(() => SubscriptionType)
  public subscriptionType: SubscriptionType;
}
