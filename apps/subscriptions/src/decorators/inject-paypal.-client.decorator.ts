import { Inject } from '@nestjs/common';
import { PAYPAL_TOKEN } from 'apps/subscriptions/src/payment-system/constants';

export const InjectPaypalClient = () => Inject(PAYPAL_TOKEN);
