import { Inject } from '@nestjs/common';
import { STRIPE_TOKEN } from 'apps/subscriptions/src/payment-system/constants';

export const InjectStripeClient = () => Inject(STRIPE_TOKEN);
