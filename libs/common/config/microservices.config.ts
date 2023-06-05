import { registerAs } from '@nestjs/config';

export const globalConfig = registerAs('global', () => ({
  subscriptions: {
    host:
      process.env.MODE === 'production'
        ? process.env.SUBSCRIPTIONS_HOST
        : 'localhost',
    port:
      process.env.MODE === 'production'
        ? parseInt(<string>process.env.SUBSCRIPTIONS_PORT)
        : 5001,
  },
}));
