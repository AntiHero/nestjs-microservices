import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CheckoutDto } from '../dto/checkout.dto';
import { PaymentsQueryDto } from '@app/common/dto/payments-query.dto';
import { JwtAtGuard } from 'apps/root/src/common/guards/jwt-auth.guard';
import { ActiveUser } from 'apps/root/src/common/decorators/active-user.decorator';
import {
  PriceListApiDecorator,
  CancelSubscriptionApiDecorator,
  CheckoutSessionApiDecorator,
  SubscriptionsPaymentsApiDecorator,
} from 'apps/subscriptions/src/decorators/swagger/subscriptions.decorator';
import { SubscriptionsServiceAdapter } from '../services/subscriptions.service-adapter';
import { firstValueFrom } from 'rxjs';
import { BaseHttpException } from '@app/common/exceptions';

@ApiTags('Subscriptions')
@Controller('api/subscriptions')
export class SubscriptionsController {
  public constructor(
    private readonly subscriptionsService: SubscriptionsServiceAdapter,
  ) {}

  @Get('price-list')
  @PriceListApiDecorator()
  public async prices() {
    return this.subscriptionsService.getPriceList();
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
    const result = await firstValueFrom(
      this.subscriptionsService.getCheckoutSessionUrl({
        priceId,
        paymentSystem,
        userId,
      }),
    );

    if (result.err) throw new BaseHttpException(result.err);

    return result.data;
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
