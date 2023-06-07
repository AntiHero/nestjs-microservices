import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Result } from '@app/common/interfaces/result.interface';
import { StartPaymentCommand } from './use-cases/start-payment.use-case';
import { SUBSCRIPTIONS_PATTERNS } from '@app/common/patterns/subscriptions.patterns';
import { SubscriptionsQueryRepository } from './repositories/subscriptions.query-repository';
import { GetCheckoutSessionUrlPayload } from '@app/common/interfaces/get-checkout-session-url-payload.interface';

@Controller()
export class SubscriptionsController {
  public constructor(
    private readonly subscriptionsQueryRepository: SubscriptionsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @MessagePattern(SUBSCRIPTIONS_PATTERNS.GET_PRICES())
  public getPrices() {
    return this.subscriptionsQueryRepository.getPriceList();
  }

  @MessagePattern(SUBSCRIPTIONS_PATTERNS.GET_CHECKOUT_SESSION_URL())
  public async getCheckoutSessionUrl(payload: GetCheckoutSessionUrlPayload) {
    const { priceId, paymentSystem, userId } = payload;

    const result = await this.commandBus.execute<
      StartPaymentCommand,
      Result<string>
    >(new StartPaymentCommand(paymentSystem, priceId, userId));

    return result;
  }
}
