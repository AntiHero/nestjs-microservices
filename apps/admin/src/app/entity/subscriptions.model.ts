import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { type Payment } from '.prisma/subscriptions';
import { prop } from '@typegoose/typegoose';
import {
  Currency,
  PaymentProvider,
  PaymentStatus,
  SubscriptionType,
} from '@app/common/enums';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SubscriptionModel extends Base {}
export class PaymentModel
  extends TimeStamps
  implements Record<keyof Omit<Payment, 'createdAt' | 'updatedAt'>, any>
{
  @prop({ unique: true })
  public id: string;

  @prop()
  public startDate: Date;

  @prop()
  public endDate: Date;

  @prop()
  public userId: string;

  @prop({ type: () => String, enum: Currency })
  public currency: Currency;

  @prop()
  public price: number;

  @prop({ type: () => String, enum: PaymentStatus })
  public status: PaymentStatus;

  @prop({ type: () => String, enum: PaymentProvider })
  public provider: PaymentProvider;

  @prop()
  public reference: 'SUBSCRIPTIONS';

  @prop({ type: () => String, enum: SubscriptionType })
  public type: SubscriptionType;
}

// {
//   "type": "ONETIME",
//   "startDate": "2023-06-08T20:14:42.302Z",
//   "endDate": "2023-07-09T20:29:20.072Z",
//   "id": "ba7c5429-3f81-4c0f-8f45-6d42287c2b7c",
//   "userId": "92a96d92-6397-4d7b-9347-7868ef99b2da",
//   "currency": "USD",
//   "price": 10,
//   "status": "CONFIRMED",
//   "reference": "SUBSCRIPTION",
//   "provider": "STRIPE",
//   "createdAt": "2023-06-08T20:14:42.302Z",
//   "updatedAt": "2023-06-08T20:29:12.448Z"
// },
