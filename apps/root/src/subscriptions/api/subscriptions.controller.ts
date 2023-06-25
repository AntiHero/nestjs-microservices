import { PaymentsQueryDto }            from '@app/common/dtos/payments-query.dto';
import { BaseHttpException }           from '@app/common/exceptions';
import { PaymentsMapper }              from '@app/common/utils/payments.mapper';
import { SubscriptionsMapper }         from '@app/common/utils/subscriptions-mapper';
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
import { ApiTags }                     from '@nestjs/swagger';
import { firstValueFrom }              from 'rxjs';

import { ActiveUser }                  from 'apps/root/src/common/decorators/active-user.decorator';
import { JwtGuard }                    from 'apps/root/src/common/guards/jwt-auth.guard';
import {
  CancelSubscriptionApiDecorator,
  CheckoutSessionApiDecorator,
  PriceListApiDecorator,
  SubscriptionsPaymentsApiDecorator,
} from 'apps/root/src/subscriptions/@common/decorators/swagger/subscriptions.decorator';

import { CheckoutDto }                 from '../dto/checkout.dto';
import { SubscriptionsServiceAdapter } from '../services/subscriptions.service-adapter';

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
  @UseGuards(JwtGuard)
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

  @Get('payments')
  @SubscriptionsPaymentsApiDecorator()
  @UseGuards(JwtGuard)
  public async getPayments(
    @ActiveUser('userId') userId: string,
    @Query() query: PaymentsQueryDto,
  ) {
    const result = await firstValueFrom(
      this.subscriptionsService.getPayments(userId, query),
    );

    if (result.err) throw new BaseHttpException(result.err);

    return PaymentsMapper.toViewModel(result.data);
  }

  @Post('cancel')
  @UseGuards(JwtGuard)
  @CancelSubscriptionApiDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async cancelSubscription(@ActiveUser('userId') userId: string) {
    const result = await firstValueFrom(
      this.subscriptionsService.cancelSubscription(userId),
    );

    if (result.err) throw new BaseHttpException(result.err);
  }

  @Get('current')
  @UseGuards(JwtGuard)
  public async getCurrentSubscription(@ActiveUser('userId') userId: string) {
    const result = await firstValueFrom(
      this.subscriptionsService.getCurrentSubscription(userId),
    );

    if (result.err) throw new BaseHttpException(result.err);

    if (!result.data) return null;

    return SubscriptionsMapper.toViewModel(result.data);
  }
}
