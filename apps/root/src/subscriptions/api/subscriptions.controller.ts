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
import { PaymentsQueryDto } from '@app/common/dtos/payments-query.dto';
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
import { PaymentsMapper } from '@app/common/utils/payments.mapper';
import { SubscriptionsMapper } from '@app/common/utils/subscriptions-mapper';

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

  @Get('payments')
  @SubscriptionsPaymentsApiDecorator()
  @UseGuards(JwtAtGuard)
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
  @UseGuards(JwtAtGuard)
  @CancelSubscriptionApiDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async cancelSubscription(@ActiveUser('userId') userId: string) {
    const result = await firstValueFrom(
      this.subscriptionsService.cancelSubscription(userId),
    );

    if (result.err) throw new BaseHttpException(result.err);
  }

  @Get('current')
  @UseGuards(JwtAtGuard)
  public async getCurrentSubscription(@ActiveUser('userId') userId: string) {
    const result = await firstValueFrom(
      this.subscriptionsService.getCurrentSubscription(userId),
    );

    if (result.err) throw new BaseHttpException(result.err);

    if (!result.data) return null;

    return SubscriptionsMapper.toViewModel(result.data);
  }
}
