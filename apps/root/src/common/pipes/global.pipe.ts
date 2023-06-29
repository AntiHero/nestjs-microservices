import { INestApplication, ValidationPipe } from '@nestjs/common';

import { TrimPipe }                         from './trim.pipe';

export function useGlobalPipes(app: INestApplication) {
  app.useGlobalPipes(
    new TrimPipe(),
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );
}
