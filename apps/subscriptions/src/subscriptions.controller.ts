import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Result } from '@app/common/interfaces/result.interface';
import { PaymentsQueryDto } from '@app/common/dto/payments-query.dto';
import { StartPaymentCommand } from './use-cases/start-payment.use-case';
import { CancelSubscriptionCommand } from './use-cases/cancel-subscription.use-case';
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

  @MessagePattern(SUBSCRIPTIONS_PATTERNS.GET_PAYMENTS())
  public async getPayments(payload: {
    userId: string;
    query: PaymentsQueryDto;
  }) {
    const { userId, query } = payload;
    try {
      const result = await this.subscriptionsQueryRepository.getPaymentsByQuery(
        userId,
        query,
      );

      return {
        data: result,
      };
    } catch (error: any) {
      return {
        data: null,
        err: {
          errorCode: error.response.statusCode,
          message: error.response.message,
        },
      };
    }
  }

  @MessagePattern(SUBSCRIPTIONS_PATTERNS.CANCEL_SUBSCRIPTION())
  public async cancelSubscripton(userId: string) {
    try {
      await this.commandBus.execute(new CancelSubscriptionCommand(userId));

      return { data: null };
    } catch (error: any) {
      return {
        data: null,
        err: {
          errorCode: error.response.statusCode,
          message: error.response.message,
        },
      };
    }
  }

  @MessagePattern(SUBSCRIPTIONS_PATTERNS.GET_CURRENT_SUBSCRIPTION())
  public async getCurrentSubscription(userId: string) {
    try {
      const result =
        await this.subscriptionsQueryRepository.getUserCurrentSubscription(
          userId,
        );

      return { data: result };
    } catch (error: any) {
      return {
        data: null,
        err: {
          errorCode: error.response.statusCode,
          message: error.response.message,
        },
      };
    }
  }
}
