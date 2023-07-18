import {
  PaymentProvider,
  SubscriptionPrice,
  SubscriptionStatus,
} from '.prisma/subscriptions';
import { SubscriptionType }                            from '@app/common/enums';
import { BaseTransactionUseCase }                      from '@app/common/use-cases/base-transaction.use-case';
import { Result }                                      from '@app/common/utils/result.util';
import { HttpStatus, Inject }                          from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreatePaymentsCommand, PaymentData }          from './create-payments.use-case';
import { PAYMENT_STRATEGIES }                          from '../constants';
import {
  PaymentCommand,
  PaymentStrategy,
} from '../payment-strategies/abstract.strategy';
import { PrismaService }                               from '../prisma/prisma.service';
import { SubscriptionsQueryRepository }                from '../repositories/subscriptions.query-repository';
import { SubscriptionsRepository }                     from '../repositories/subscriptions.repository';

export class ProcessCheckoutTransactionCommand {
  public constructor(
    public readonly paymentProvider: PaymentProvider,
    public readonly priceId: string,
    public readonly userId: string,
  ) {}
}

type PaymentStrategiesMap = {
  [key in PaymentProvider]?: PaymentStrategy<string | null>;
};

@CommandHandler(ProcessCheckoutTransactionCommand)
export class ProcessCheckoutTransactionCommandHandler
  extends BaseTransactionUseCase<
    PrismaService,
    ProcessCheckoutTransactionCommand,
    Result<string | null>
  >
  implements ICommandHandler<ProcessCheckoutTransactionCommand>
{
  private paymentStrategiesMap: PaymentStrategiesMap = {};

  public constructor(
    @Inject(PAYMENT_STRATEGIES)
    private readonly paymentStrategies: PaymentStrategy<string | null>[],
    private readonly commandBus: CommandBus,
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly subscriptionsQueryRepository: SubscriptionsQueryRepository,
    prismaService: PrismaService,
  ) {
    super(prismaService);

    this.paymentStrategies.forEach((strategy) => {
      this.paymentStrategiesMap[strategy.provider] = strategy;
    });
  }

  public async onExecute(
    command: ProcessCheckoutTransactionCommand,
  ): Promise<Result<string | null>> {
    const { priceId, userId, paymentProvider: provider } = command;

    if (!this.paymentStrategiesMap[provider]) {
      return new Result(
        null,
        HttpStatus.NOT_FOUND,
        'Payment provider was not found.',
      );
    }

    const price =
      await this.subscriptionsQueryRepository.getSubscriptionPriceById(priceId);

    if (!price)
      return new Result(
        null,
        HttpStatus.NOT_FOUND,
        'Price for subscription was not found.',
      );

    const subscriptionType = SubscriptionType.ONETIME;

    const pricingPlan =
      await this.subscriptionsQueryRepository.getSubscriptionPricingPlanByQuery(
        {
          priceId,
          provider,
          subscriptionType,
        },
      );

    if (!pricingPlan)
      return new Result(
        null,
        HttpStatus.NOT_FOUND,
        'Pricing plan for subscription not found',
      );

    const { id: pricingPlanId, providerPriceId } = pricingPlan;

    const { subscriptionPaymentId, paymentId } = await this.commandBus.execute<
      CreatePaymentsCommand,
      PaymentData
    >(
      new CreatePaymentsCommand(this.tx, {
        priceId,
        userId,
        provider,
        pricingPlanId,
      }),
    );

    const { id: subscriptionId } =
      await this.subscriptionsRepository.createSubscription(this.tx, {
        userId,
        type: SubscriptionType.ONETIME,
        status: SubscriptionStatus.PENDING,
        subscriptionPaymentId,
      });

    const { period, periodType } = <SubscriptionPrice>(
      await this.subscriptionsQueryRepository.getSubscriptionPriceById(priceId)
    );

    const result =
      ((await this.paymentStrategiesMap[provider]?.execute(
        new PaymentCommand({
          userId,
          paymentId,
          subscriptionId,
          providerPriceId,
          period,
          periodType,
        }),
      )) as string) || null;

    return new Result(result);
  }
}
