import {
  PaymentProvider,
  PaymentStatus,
  SubscriptionPrice,
} from '.prisma/subscriptions';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PrismaTransactionType }           from '../interfaces/prisma-transaction.interface';
import { SubscriptionsQueryRepository }    from '../repositories/subscriptions.query-repository';
import { SubscriptionsRepository }         from '../repositories/subscriptions.repository';

export class CreatePaymentsCommand {
  public constructor(
    public readonly tx: PrismaTransactionType,
    public readonly data: {
      priceId: string;
      userId: string;
      provider: PaymentProvider;
      pricingPlanId: string;
    },
  ) {}
}

export interface PaymentData {
  paymentId: string;
  subscriptionPaymentId: string;
}

@CommandHandler(CreatePaymentsCommand)
export class CreatePaymentsCommandHandler
  implements ICommandHandler<CreatePaymentsCommand>
{
  public constructor(
    private readonly subscriptionsQueryRepository: SubscriptionsQueryRepository,
    private readonly subscriptionsRepository: SubscriptionsRepository,
  ) {}

  public async execute(command: CreatePaymentsCommand): Promise<PaymentData> {
    const {
      tx,
      data: { priceId, provider, pricingPlanId, userId },
    } = command;

    const { currency, value: price } = <SubscriptionPrice>(
      await this.subscriptionsQueryRepository.getSubscriptionPriceById(priceId)
    );

    const status = PaymentStatus.PENDING;

    const payment = await this.subscriptionsRepository.createPayments(tx, {
      userId,
      price,
      currency,
      pricingPlanId,
      provider,
      status,
    });

    return {
      paymentId: payment.id,
      subscriptionPaymentId: <string>payment.subscriptionPayment?.id,
    };
  }
}
