import { registerAs }     from '@nestjs/config';

import { setEnvVariable } from '../utils/set-env-variable.util';

interface TransportOptins {
  host: string;
  port: number;
  tcpPort: number;
}

export interface GlobalConfig {
  subscriptions: TransportOptins;
  root: TransportOptins;
  rabbit: {
    uri: string;
  };
  cache: {
    ttl: number;
  };
}

export const globalConfig = registerAs(
  'global',
  (): GlobalConfig => ({
    subscriptions: {
      host: setEnvVariable(process.env.SUBSCRIPTIONS_HOST, 'localhost'),
      port: setEnvVariable(parseInt(process.env.SUBSCRIPTIONS_PORT || '6000')),
      tcpPort: setEnvVariable(
        parseInt(process.env.SUBSCRIPTIONS_TCP_PORT || '6001'),
      ),
    },
    root: {
      host: setEnvVariable(process.env.ROOT_HOST, 'localhost'),
      port: setEnvVariable(parseInt(process.env.ROOT_PORT || '5000')),
      tcpPort: setEnvVariable(parseInt(process.env.ROOT_TCP_PORT || '5001')),
    },
    rabbit: {
      uri: setEnvVariable(process.env.RABBIT_MQ_URI, 'amqp://localhost:5672'),
    },
    cache: {
      ttl: Number(setEnvVariable(process.env.CACHE_TTL, '30')),
    },
  }),
);
