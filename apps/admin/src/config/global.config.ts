import { registerAs } from '@nestjs/config';

export const globalConfig = registerAs('global', () => ({
  port: process.env.PORT,
  tcpPort: process.env.TCP_PORT,
}));
