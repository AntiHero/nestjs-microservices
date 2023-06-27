import { PaymentsQueryDto }                  from '@app/common/dtos/payments-query.dto';
import { GetCheckoutSessionUrlPayload }      from '@app/common/interfaces/get-checkout-session-url-payload.interface';
import { SubscriptionCommand }               from '@app/common/patterns/subscriptions.pattern';
import { Result }                            from '@app/common/utils/result.util';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus }                        from '@nestjs/cqrs';
import { MessagePattern }                    from '@nestjs/microservices';
import { ApiExcludeEndpoint }                from '@nestjs/swagger';

import { StripeWebhookGuard }                from '../guards/stripe-webhook.guard';
import { StripeEvent }                       from '../interfaces';
import { SubscriptionsQueryRepository }      from '../repositories/subscriptions.query-repository';
import { CancelSubscriptionCommand }         from '../use-cases/cancel-subscription.use-case';
import { ProcessCheckoutTransactionCommand } from '../use-cases/process-checkout-transaction.use-case';
import { ProcessPaymentCommand }             from '../use-cases/process-payment.use-case';
import { SubscriptionMapper }                from '../utils/subscription-mapper';

@Controller()
export class SubscriptionsController {
  public constructor(
    private readonly subscriptionsQueryRepository: SubscriptionsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @MessagePattern(SubscriptionCommand.GetPrices)
  public getPrices() {
    return this.subscriptionsQueryRepository.getPriceList();
  }

  @MessagePattern(SubscriptionCommand.GetCheckoutSessionUrl)
  public async getCheckoutSessionUrl(payload: GetCheckoutSessionUrlPayload) {
    const { priceId, paymentSystem, userId } = payload;

    const result = await this.commandBus.execute<
      ProcessCheckoutTransactionCommand,
      Result<string>
    >(new ProcessCheckoutTransactionCommand(paymentSystem, priceId, userId));

    return result;
  }

  @MessagePattern(SubscriptionCommand.GetUserPayments)
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

      return new Result(result);
    } catch (error: any) {
      return new Result(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Can not retrieve payments',
      );
    }
  }

  @MessagePattern(SubscriptionCommand.CancelSubscription)
  public async cancelSubscripton(payload: { userId: string }) {
    try {
      await this.commandBus.execute(
        new CancelSubscriptionCommand(payload.userId),
      );

      return new Result(null);
    } catch (error: any) {
      return new Result(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Can not cancel subscription',
      );
    }
  }

  @MessagePattern(SubscriptionCommand.GetCurrentSubscription)
  public async getCurrentSubscription(payload: { userId: string }) {
    try {
      const result =
        await this.subscriptionsQueryRepository.getUserCurrentSubscription(
          payload.userId,
        );

      return new Result(result && SubscriptionMapper.toViewModel(result));
    } catch (error: any) {
      return new Result(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Can not get current subscription',
      );
    }
  }

  @ApiExcludeEndpoint()
  @Post('stripe-webhook')
  @UseGuards(StripeWebhookGuard)
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() event: StripeEvent<any>) {
    await this.commandBus.execute(new ProcessPaymentCommand(event));
  }

  @Get('health-check')
  async healthCheck() {
    return;
  }
}
