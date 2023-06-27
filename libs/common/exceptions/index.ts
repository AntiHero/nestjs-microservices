import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Err } from '../utils/result.util';

export class BaseHttpException {
  public constructor(readonly errorResult: Err) {
    switch (errorResult.errorCode) {
      case HttpStatus.NOT_FOUND:
        throw new NotFoundException(errorResult.errorMessage);
      case HttpStatus.FORBIDDEN:
        throw new ForbiddenException(errorResult.errorMessage);
      case HttpStatus.BAD_REQUEST:
        throw new BadRequestException(errorResult.errorMessage);
      default:
        throw new InternalServerErrorException(errorResult.errorMessage);
    }
  }
}
