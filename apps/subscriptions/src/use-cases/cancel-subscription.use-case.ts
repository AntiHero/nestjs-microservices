import { SubscriptionStatus }              from '.prisma/subscriptions';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectStripe }                    from 'nestjs-stripe';

import { PrismaService }                   from 'apps/subscriptions/src/prisma/prisma.service';

import { SubscriptionsQueryRepository }    from '../repositories/subscriptions.query-repository';
import { SubscriptionsRepository }         from '../repositories/subscriptions.repository';

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
    @InjectStripe()
    private readonly subscriptionsTransactionService: SubscriptionsRepository,
  ) {}

  public async execute(command: CancelSubscriptionCommand) {
    const { userId } = command;

    const currentActiveSubscription =
      await this.subscriptionsQueryRepository.getSubscriptionByQuery({
        userId,
        status: SubscriptionStatus.ACTIVE,
      });

    if (currentActiveSubscription) {
      await this.subscriptionsTransactionService.cancelSubscription(
        this.prismaService,
        currentActiveSubscription.id,
      );
    }
  }
}
