import { SubscriptionStatus, SubscriptionType } from '.prisma/subscriptions';
import { Result } from '@app/common/interfaces/result.interface';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SubscriptionsQueryRepository } from '../repositories/subscriptions.query-repository';

export class ValidatePaymentInputCommand {
  public constructor(
    public readonly userId: string,
    public readonly priceId: string,
  ) {}
}

@CommandHandler(ValidatePaymentInputCommand)
export class ValidatePaymentInputCommandHandler
  implements ICommandHandler<ValidatePaymentInputCommand>
{
  public constructor(
    private readonly subscriptionsQueryRepository: SubscriptionsQueryRepository,
  ) {}

  public async execute(
    command: ValidatePaymentInputCommand,
  ): Promise<Result | void> {
    const { userId, priceId } = command;

    const [price, currentActiveSubscription] = await Promise.all([
      this.subscriptionsQueryRepository.getSubscriptionPriceById(priceId),
      this.subscriptionsQueryRepository.getSubscriptionByQuery({
        userId,
        status: SubscriptionStatus.ACTIVE,
        type: SubscriptionType.RECCURING,
      }),
    ]);

    if (!price)
      return {
        data: null,
        err: {
          errorCode: 404,
          message: 'Price for subscription was not found',
        },
      };

    if (currentActiveSubscription?.endDate || new Date() > new Date()) {
      return {
        data: null,
        err: {
          errorCode: 403,
          message: 'Cancel auto renew of your current subscription',
        },
      };
    }
  }
}
