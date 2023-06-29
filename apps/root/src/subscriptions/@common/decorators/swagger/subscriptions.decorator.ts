import { Currency, PaymentProvider, PeriodType } from '.prisma/subscriptions';
import { SubscriptionType }                      from '@app/common/enums';
import { applyDecorators }                       from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';
import { Payment }                               from 'apps/subscriptions/src/interfaces';

import { CheckoutDto }                           from 'apps/root/src/subscriptions/dto/checkout.dto';

export function PriceListApiDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get list of subscriptions prices',
    }),
    ApiOkResponse({
      type: GetPriceListResponse,
    }),
    ApiInternalServerErrorResponse({
      description:
        'An error occurs when attempting to get prices from database',
    }),
  );
}

export function CheckoutSessionApiDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create checkout session',
    }),
    ApiBody({
      type: CreateCheckoutSessionResponse,
    }),
    ApiOkResponse({
      schema: {
        type: 'string',
        format: 'url',
        example:
          'https://checkout.stripe.com/c/pay/cs_test_a1W2qbeRlrwaosf55VeiFoCzPFQ3zCGNYylg90oLZ3BHrNWaM3YGoxAENk#fidkdWxOYHwnPyd1blpxYHZxWjA0SzFQT2xGbElwc0pdQWZUVGtrT39kMURTUEZAZ2QxMn1sbkNfaUo0YDxDT3JSVFc9VGZSNDxjS1R9aFJIZ0BSV05UQmNdanVXS0pNMUBiQnB%2FUlVIczN2NTVGUmlLbE5hMScpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl',
      },
    }),
    ApiInternalServerErrorResponse({
      description:
        'An error occurs when attempting to get prices from database',
    }),
    ApiBearerAuth(),
  );
}

export function SubscriptionsPaymentsApiDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retrieve payments',
    }),
    ApiOkResponse({
      type: SubscriptionsPaymentsResponse,
    }),
    ApiInternalServerErrorResponse({
      description:
        'An error occurs when attempting to get payments from database',
    }),
    ApiBearerAuth(),
  );
}

export function CancelSubscriptionApiDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cancel current subscription',
    }),
    ApiNoContentResponse({
      description: 'Subscription was successfully cancelled',
    }),
    ApiBadRequestResponse({
      description: 'Bad request to Stripe server',
    }),
    ApiInternalServerErrorResponse({
      description: 'An error occurs when attempting to get data from database',
    }),
    ApiBearerAuth(),
  );
}

export function CurrentSubscriptionApiDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get current subscription',
    }),
    ApiOkResponse({
      type: SubscriptionResponse,
    }),
    ApiBadRequestResponse({
      description: 'Bad request to Stripe server',
    }),
    ApiInternalServerErrorResponse({
      description: 'An error occurs when attempting to get data from database',
    }),
    ApiBearerAuth(),
  );
}

class SubscriptionResponse {
  @ApiProperty({ enum: Currency })
  currency: Currency;

  @ApiProperty()
  amount: number;

  @ApiProperty({ format: 'DD.MM.YYYY', example: '30.05.2023' })
  startDate: string;

  @ApiProperty({ format: 'DD.MM.YYYY', example: '30.06.2023' })
  endDate: string;

  @ApiProperty()
  period: number;

  @ApiProperty({ enum: PeriodType })
  periodType: PeriodType;
}

class SubscriptionsPaymentsResponse {
  @ApiProperty()
  count: number;

  @ApiProperty({
    type: () => [PaymentsResponseType],
  })
  payments: Payment[];
}

class PaymentsResponseType implements Payment {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public price: number;

  @ApiProperty({
    enum: Object.keys(PaymentProvider),
    description: 'Payment type',
  })
  public provider: PaymentProvider;

  @ApiProperty()
  public endDate: string;

  @ApiProperty()
  public paymentDate: string;

  @ApiProperty({ description: 'Subscription period' })
  public period: number;

  @ApiProperty({
    enum: PeriodType,
    description: 'Subscription period type',
  })
  public periodType: PeriodType;
}

class GetPriceListResponse {
  @ApiProperty()
  public id: string;

  @ApiProperty({ enum: Currency })
  public currency: Currency;

  @ApiProperty({ description: 'Period of subscription in months' })
  public period: number;

  @ApiProperty({ description: 'Actual price value in currency' })
  public value: number;
}

class CreateCheckoutSessionResponse implements CheckoutDto {
  @ApiProperty()
  public priceId: string;

  @ApiProperty({ required: false })
  public renew: boolean;

  @ApiProperty({ enum: PaymentProvider })
  public paymentSystem: PaymentProvider;
}
