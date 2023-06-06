import { ApiTags } from '@nestjs/swagger';
// import { CommandBus } from '@nestjs/cqrs';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CheckoutDto } from '../dto/checkout.dto';
// import { PaymentsMapper } from '../../../../subscriptions/utils/payments.mapper';
import { PaymentsQueryDto } from '@app/common/dto/payments-query.dto';
import { JwtAtGuard } from 'apps/root/src/common/guards/jwt-auth.guard';
// import type { StripeEvent } from '@app/common/interfaces/events.interface';
import { ActiveUser } from 'apps/root/src/common/decorators/active-user.decorator';
// import { StartPaymentCommand } from '../../../../subscriptions/use-cases/start-payment.use-case';
// import { StripeWebhookGuard } from 'apps/root/src/common/guards/stripe-webhook.guard';
import {
  PriceListApiDecorator,
  CancelSubscriptionApiDecorator,
  CheckoutSessionApiDecorator,
  SubscriptionsPaymentsApiDecorator,
} from 'apps/subscriptions/src/decorators/swagger/subscriptions.decorator';
import { SUBSCRIPTIONS_PATTERNS } from '@app/common/patterns/subscriptions.patterns';
import { firstValueFrom } from 'rxjs';
import { PaymentsMapper } from 'apps/subscriptions/src/utils/payments.mapper';
import { SubscriptionsServiceAdapter } from '../services/subscriptions.service-adapter';
// import { ProcessPaymentCommand } from '../../../../subscriptions/use-cases/process-payment.use-case';
// import { CancelSubscriptionCommand } from '../../../../subscriptions/use-cases/cancel-subscription.use-case';
// import { SubscriptionsQueryRepository } from '../../../../subscriptions/repositories/subscriptions.query-repository';

@ApiTags('Subscriptions')
@Controller('api/subscriptions')
export class SubscriptionsController {
  public constructor(
    private readonly subscriptionsService: SubscriptionsServiceAdapter,
  ) {}
  // public constructor()
  // private readonly subscriptionsQueryRepository: SubscriptionsQueryRepository,
  // private readonly commandBus: CommandBus,
  // {}

  @Get('price-list')
  @PriceListApiDecorator()
  public async prices() {
    console.log('here');
    return this.subscriptionsService.getPriceList();
    // return this.subscriptionsQueryRepository.getPriceList();
  }

  @Post('checkout-session')
  @CheckoutSessionApiDecorator()
  @UseGuards(JwtAtGuard)
  @HttpCode(HttpStatus.OK)
  public async createCheckoutSession(
    @ActiveUser('userId') userId: string,
    @Body() checkoutDto: CheckoutDto,
  ) {
    const { priceId, paymentSystem } = checkoutDto;

    // return this.subscriptionsClient.send<string, any>(
    //   SUBSCRIPTIONS_PATTERNS.GET_CHECKOUT_SESSION_URL(),
    //   {
    //     userId,
    //     priceId,
    //     paymentSystem,
    //   },
    // );

    // const url = await this.commandBus.execute<
    //   StartPaymentCommand,
    //   string | null
    // >(new StartPaymentCommand(paymentSystem, priceId, userId));
    // const url = '';

    // return url;
  }

  // @ApiExcludeEndpoint()
  // @Post('stripe-webhook')
  // @UseGuards(StripeWebhookGuard)
  // @HttpCode(HttpStatus.OK)
  // async webhook(@Body() event: StripeEvent<any>) {
  //   console.log(event);
  //   await this.commandBus.execute(new ProcessPaymentCommand(event));
  // }

  @Get('payments')
  @SubscriptionsPaymentsApiDecorator()
  @UseGuards(JwtAtGuard)
  public async getPayments(
    @ActiveUser('userId') userId: string,
    @Query() query: PaymentsQueryDto,
  ) {
    // const result = await firstValueFrom(
    //   this.subscriptionsClient.send<any, any>(
    //     SUBSCRIPTIONS_PATTERNS.GET_PAYMENTS(),
    //     {
    //       userId,
    //       query,
    //     },
    //   ),
    // );
    // return PaymentsMapper.toViewModel(result);
    // return result;
    // const result = await this.subscriptionsQueryRepository.getPaymentsByQuery(
    //   userId,
    //   query,
    // );
    // return PaymentsMapper.toViewModel(result);
  }

  @Post('cancel')
  @UseGuards(JwtAtGuard)
  @CancelSubscriptionApiDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async cancelSubscription(@ActiveUser('userId') userId: string) {
    // return this.subscriptionsClient.send<void, any>(
    //   SUBSCRIPTIONS_PATTERNS.CANCEL_SUBSCRIPTION(),
    //   {
    //     userId,
    //   },
    // );
    // await this.commandBus.execute(new CancelSubscriptionCommand(userId));
  }

  @Get('current')
  @UseGuards(JwtAtGuard)
  public async getCurrentSubscription(@ActiveUser('userId') userId: string) {
    // return this.subscriptionsClient.send<void, any>(
    //   SUBSCRIPTIONS_PATTERNS.GET_CURRENT_SUBSCRIPTION(),
    //   {
    //     userId,
    //   },
    // );
    //   const subscription =
    //     await this.subscriptionsQueryRepository.getUsersCurrentSubscription(
    //       userId,
    //     );
    //   if (!subscription) return null;
    //   return SubscriptionMapper.toViewModel(subscription);
  }
}
