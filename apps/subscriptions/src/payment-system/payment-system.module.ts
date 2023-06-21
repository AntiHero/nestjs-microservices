import { DynamicModule, Module } from '@nestjs/common';

import type {
  PaypalAsyncOptions,
  PaypalOptions,
  StripeAsyncOptions,
  StripeOptions,
} from './interfaces';
import { PaypalCoreModule } from './paypal.core.module';
import { StripeCoreModule } from './stripe.core.module';

@Module({})
export class PaymentSystemModule {
  public static setupStripe(options: StripeOptions): DynamicModule {
    return {
      module: PaymentSystemModule,
      imports: [StripeCoreModule.forRoot(options)],
    };
  }

  public static setupStripeAsync(options: StripeAsyncOptions): DynamicModule {
    return {
      module: PaymentSystemModule,
      imports: [StripeCoreModule.forRootAsync(options)],
    };
  }

  public static setupPaypal(options: PaypalOptions): DynamicModule {
    return {
      module: PaymentSystemModule,
      imports: [PaypalCoreModule.forRoot(options)],
    };
  }

  public static setupPaypalAsync(options: PaypalAsyncOptions): DynamicModule {
    return {
      module: PaymentSystemModule,
      imports: [PaypalCoreModule.forRootAsync(options)],
    };
  }
}
