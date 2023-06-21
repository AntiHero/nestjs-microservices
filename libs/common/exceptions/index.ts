import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ErrorResult } from '../interfaces/result.interface';

export class BaseHttpException {
  public constructor(readonly errorResult: ErrorResult) {
    switch (errorResult.errorCode) {
      case HttpStatus.NOT_FOUND:
        throw new NotFoundException(errorResult.message);
      case HttpStatus.FORBIDDEN:
        throw new ForbiddenException(errorResult.message);
      case HttpStatus.BAD_REQUEST:
        throw new BadRequestException(errorResult.message);
      default:
        throw new InternalServerErrorException(errorResult.message);
    }
  }
}
