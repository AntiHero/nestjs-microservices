import { registerAs } from '@nestjs/config';

export const localConfig = registerAs('local', () => ({
  port: process.env.PORT,
  tcpPort: process.env.TCP_PORT,
}));
