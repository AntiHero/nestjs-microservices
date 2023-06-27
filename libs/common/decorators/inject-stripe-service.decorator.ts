import { Inject }                 from '@nestjs/common';

import { STRIPE_PAYMENT_SERVICE } from 'apps/subscriptions/src/constants';

export const InjectStripeService = () => Inject(STRIPE_PAYMENT_SERVICE);
