import { PaymentProvider } from '.prisma/subscriptions';
import { PeriodType }      from '@app/common/enums/period-type.enum';

export class PaymentCommand {
  public constructor(
    public readonly data: {
      userId: string;
      providerPriceId: string;
      subscriptionId: string;
      paymentId: string;
      period: number;
      periodType: PeriodType;
    },
  ) {}
}

export abstract class PaymentStrategy<R> {
  public abstract provider: PaymentProvider;

  public abstract execute(command: PaymentCommand): Promise<R>;
}
