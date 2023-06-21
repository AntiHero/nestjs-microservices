import { type Payment }     from '.prisma/subscriptions';
import {
  Currency,
  PaymentProvider,
  PaymentStatus,
  SubscriptionType,
}                           from '@app/common/enums';
import { prop }             from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SubscriptionModel extends Base {}
export class PaymentModel
  extends TimeStamps
  implements
    Record<keyof Omit<Payment, 'createdAt' | 'updatedAt' | 'reference'>, any>
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

  @prop({ type: () => String, enum: SubscriptionType })
  public type: SubscriptionType;
}
