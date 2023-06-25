import { type Payment }           from '.prisma/subscriptions';
import {
  Currency,
  PaymentProvider,
  PaymentStatus,
  SubscriptionType,
} from '@app/common/enums';
import { PeriodType }             from '@app/common/enums/period-type.enum';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { TimeStamps }             from '@typegoose/typegoose/lib/defaultClasses';

export class PaymentClass
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

  @prop()
  public period: number;

  @prop({ type: () => String, enum: PeriodType })
  public periodType: PeriodType;
}

export const PaymentModel = getModelForClass(PaymentClass);
