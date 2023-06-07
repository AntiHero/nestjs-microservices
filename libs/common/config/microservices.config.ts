import { registerAs } from '@nestjs/config';

export const globalConfig = registerAs('global', () => ({
  subscriptions: {
    host:
      process.env.MODE === 'production'
        ? process.env.SUBSCRIPTIONS_HOST
        : 'localhost',
    tcpPort:
      process.env.MODE === 'production'
        ? parseInt(<string>process.env.SUBSCRIPTIONS_TCP_PORT)
        : 6000,
  },
  root: {
    host:
      process.env.MODE === 'production' ? process.env.ROOT_HOST : 'localhost',
    tcpPort:
      process.env.MODE === 'root'
        ? parseInt(<string>process.env.ROOT_TCP_PORT)
        : 5001,
  },
}));
