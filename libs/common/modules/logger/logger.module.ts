import { Global, Module } from '@nestjs/common';
import {
  Logger as PinoLogger,
  LoggerModule as PinoLoggerModule,
} from 'nestjs-pino';

import { Logger }         from 'apps/root/src/common/interfaces/logger.interface';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      },
    }),
  ],
  providers: [
    {
      provide: Logger,
      useClass: PinoLogger,
    },
  ],
  exports: [Logger],
})
export class LoggerModule {}
