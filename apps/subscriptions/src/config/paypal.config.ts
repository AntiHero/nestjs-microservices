import { ConfigService, registerAs } from '@nestjs/config';
import { PaypalOptions }             from 'nestjs-paypal';

export type PaypalConfigService = ConfigService<
  {
    paypal: PaypalOptions;
  },
  true
>;

export const paypalConfig = registerAs<PaypalOptions>('paypal', () => ({
  clientID: <string>process.env.PAYPAL_CLIENT_ID,
  secret: <string>process.env.PAYPAL_CLIENT_SECRET,
}));
