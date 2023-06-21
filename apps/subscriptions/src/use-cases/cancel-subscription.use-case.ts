import { SubscriptionStatus } from '.prisma/subscriptions';
import { InjectStripeService } from '@app/common/decorators/inject-stripe-service.decorator';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PrismaService } from 'apps/subscriptions/src/prisma/prisma.service';

import { SubscriptionsQueryRepository } from '../repositories/subscriptions.query-repository';
import { PaymentProviderService } from '../services/payment-provider.service';
import { SubscriptionsTransactionService } from '../services/subscriptions-transaction.service';

export class CancelSubscriptionCommand {
  public constructor(public readonly userId: string) {}
}

@CommandHandler(CancelSubscriptionCommand)
export class CancelSubscriptionCommandHandler
  implements ICommandHandler<CancelSubscriptionCommand>
{
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly subscriptionsQueryRepository: SubscriptionsQueryRepository,
    @InjectStripeService()
    private readonly paymentProviderService: PaymentProviderService,
    private readonly subscriptionsTransactionService: SubscriptionsTransactionService,
  ) {}

  public async execute(command: CancelSubscriptionCommand) {
    const { userId } = command;

    const currentActiveSubscription =
      await this.subscriptionsQueryRepository.getSubscriptionByQuery({
        userId,
        status: SubscriptionStatus.ACTIVE,
      });

    if (currentActiveSubscription) {
      await Promise.all([
        this.subscriptionsTransactionService.cancelSubscription(
          this.prismaService,
          currentActiveSubscription.id,
        ),
        this.paymentProviderService.cancelSubscription(
          <string>currentActiveSubscription.relatedSubscription,
        ),
      ]);
    }
  }
}
