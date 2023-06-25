import { PaymentsQueryDto }             from '@app/common/dtos/payments-query.dto';
import { GetCheckoutSessionUrlPayload } from '@app/common/interfaces/get-checkout-session-url-payload.interface';
import { Result }                       from '@app/common/interfaces/result.interface';
import { SubscriptionCommand }          from '@app/common/patterns/subscriptions.pattern';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus }                   from '@nestjs/cqrs';
import { ClientProxy, MessagePattern }  from '@nestjs/microservices';
import { ApiExcludeEndpoint }           from '@nestjs/swagger';

import { StripeWebhookGuard }           from './guards/stripe-webhook.guard';
import { StripeEvent }                  from './interfaces';
import { SubscriptionsQueryRepository } from './repositories/subscriptions.query-repository';
import { CancelSubscriptionCommand }    from './use-cases/cancel-subscription.use-case';
import { ProcessPaymentCommand }        from './use-cases/process-payment.use-case';
import { StartPaymentCommand }          from './use-cases/start-payment.use-case';

@Controller()
export class SubscriptionsController {
  public constructor(
    private readonly subscriptionsQueryRepository: SubscriptionsQueryRepository,
    private readonly commandBus: CommandBus,
    @Inject('ROOT_RMQ') private readonly rootRmqClient: ClientProxy,
  ) {}

  @MessagePattern(SubscriptionCommand.GetPrices)
  public getPrices() {
    return this.subscriptionsQueryRepository.getPriceList();
  }

  @MessagePattern(SubscriptionCommand.GetCheckoutSessionUrl)
  public async getCheckoutSessionUrl(payload: GetCheckoutSessionUrlPayload) {
    const { priceId, paymentSystem, userId } = payload;

    const result = await this.commandBus.execute<
      StartPaymentCommand,
      Result<string>
    >(new StartPaymentCommand(paymentSystem, priceId, userId));

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

  @MessagePattern(SubscriptionCommand.CancelSubscription)
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

  @MessagePattern(SubscriptionCommand.GetCurrentSubscription)
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

  @Get('health-check')
  async healthCheck() {
    return;
  }
}
