import { MessagePattern } from '@nestjs/microservices';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { StripeEvent } from './interfaces';
import { Result } from '@app/common/interfaces/result.interface';
import { StripeWebhookGuard } from './guards/stripe-webhook.guard';
import { PaymentsQueryDto } from '@app/common/dto/payments-query.dto';
import { StartPaymentCommand } from './use-cases/start-payment.use-case';
import { ProcessPaymentCommand } from './use-cases/process-payment.use-case';
import { CancelSubscriptionCommand } from './use-cases/cancel-subscription.use-case';
import { SUBSCRIPTIONS_PATTERNS } from '@app/common/patterns/subscriptions.patterns';
import { SubscriptionsQueryRepository } from './repositories/subscriptions.query-repository';
import { GetCheckoutSessionUrlPayload } from '@app/common/interfaces/get-checkout-session-url-payload.interface';

@Controller('subscriptions')
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
          errorCode: error?.response?.statusCode || 500,
          message: error?.response?.message,
        },
      };
    }
  }

  @MessagePattern(SUBSCRIPTIONS_PATTERNS.CANCEL_SUBSCRIPTION())
  public async cancelSubscripton(payload: { userId: string }) {
    try {
      await this.commandBus.execute(
        new CancelSubscriptionCommand(payload.userId),
      );

      return { data: null };
    } catch (error: any) {
      return {
        data: null,
        err: {
          errorCode: error?.response?.statusCode || 500,
          message: error?.response?.message,
        },
      };
    }
  }

  @MessagePattern(SUBSCRIPTIONS_PATTERNS.GET_CURRENT_SUBSCRIPTION())
  public async getCurrentSubscription(payload: { userId: string }) {
    try {
      const result =
        await this.subscriptionsQueryRepository.getUserCurrentSubscription(
          payload.userId,
        );

      return { data: result };
    } catch (error: any) {
      return {
        data: null,
        err: {
          errorCode: error?.response?.statusCode || 500,
          message: error?.response?.message,
        },
      };
    }
  }

  @ApiExcludeEndpoint()
  @Post('stripe-webhook')
  @UseGuards(StripeWebhookGuard)
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() event: StripeEvent<any>) {
    await this.commandBus.execute(new ProcessPaymentCommand(event));
  }
}
