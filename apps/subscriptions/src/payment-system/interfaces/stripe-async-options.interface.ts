import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

import { StripeOptionsFactory } from './stripe-options-factiory.interface';
import { StripeOptions } from './stripe-options.interface';

export interface StripeAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<StripeOptionsFactory>;
  useExisting?: Type<StripeOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<StripeOptions> | StripeOptions;
}
