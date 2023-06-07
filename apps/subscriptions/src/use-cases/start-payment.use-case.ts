import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentProvider } from '.prisma/subscriptions';
import { Inject } from '@nestjs/common';

import {
  PaymentCommand,
  PaymentStrategy,
} from '../payment-strategies/abstract.strategy';
import { PAYMENT_STRATEGIES } from '../constants';
import { Result } from '@app/common/interfaces/result.interface';
import { ValidatePaymentInputCommand } from './validate-payment-input.use-case';

export class StartPaymentCommand {
  public constructor(
    public readonly paymentProvider: PaymentProvider,
    public readonly priceId: string,
    public readonly userId: string,
  ) {}
}

type PaymentStrategiesMap = {
  [key in PaymentProvider]?: PaymentStrategy;
};

@CommandHandler(StartPaymentCommand)
export class StartPaymentCommandHandler
  implements ICommandHandler<StartPaymentCommand>
{
  private paymentStrategiesMap: PaymentStrategiesMap = {};

  public constructor(
    @Inject(PAYMENT_STRATEGIES)
    private readonly paymentStrategies: PaymentStrategy[],
    private readonly commandBus: CommandBus,
  ) {
    this.paymentStrategies.forEach((strategy) => {
      this.paymentStrategiesMap[strategy.provider] = strategy;
    });
  }

  public async execute(
    command: StartPaymentCommand,
  ): Promise<Result<string | null>> {
    const { priceId, userId, paymentProvider } = command;

    if (!this.paymentStrategiesMap[paymentProvider]) {
      return {
        data: null,
        err: { errorCode: 404, message: 'Payment provider was not found' },
      };
    }

    const validationResult = await this.commandBus.execute<
      ValidatePaymentInputCommand,
      Result<null> | void
    >(new ValidatePaymentInputCommand(userId, priceId));

    if (validationResult?.err) {
      return validationResult;
    }

    const result =
      (await this.paymentStrategiesMap[paymentProvider]?.execute(
        new PaymentCommand(userId, priceId),
      )) || null;

    return { data: result };
  }
}
