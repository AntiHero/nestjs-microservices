import { Cached }                        from '@app/common/decorators/cached.decorator';
import { PaymentsQueryDto }              from '@app/common/dtos/payments-query.dto';
import { BaseHttpException }             from '@app/common/exceptions';
import { PaymentsMapper }                from '@app/common/utils/payments.mapper';
import {
  Body,
  CacheTTL,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags }                       from '@nestjs/swagger';
import { firstValueFrom }                from 'rxjs';

import { ActiveUser }                    from 'apps/root/src/common/decorators/active-user.decorator';
import { JwtGuard }                      from 'apps/root/src/common/guards/jwt-auth.guard';
import {
  CheckoutSessionApiDecorator,
  CurrentSubscriptionApiDecorator,
  PriceListApiDecorator,
  SubscriptionsPaymentsApiDecorator,
} from 'apps/root/src/subscriptions/@common/decorators/swagger/subscriptions.decorator';

import { CheckoutDto }                   from '../dto/checkout.dto';
import { SubscriptionsServiceInterface } from '../services/subscriptions.service-adapter';

@ApiTags('Subscriptions')
@Controller('api/subscriptions')
export class SubscriptionsController {
  public constructor(
    private readonly subscriptionsService: SubscriptionsServiceInterface,
  ) {}

  @Get('price-list')
  @Cached()
  @CacheTTL(0)
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

  @Get('current')
  @UseGuards(JwtGuard)
  @CurrentSubscriptionApiDecorator()
  public async getCurrentSubscription(@ActiveUser('userId') userId: string) {
    const result = await firstValueFrom(
      this.subscriptionsService.getCurrentSubscription(userId),
    );

    if (result.err) throw new BaseHttpException(result.err);

    return result.data;
  }
}
