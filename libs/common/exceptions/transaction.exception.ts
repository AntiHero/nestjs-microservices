import { InternalServerErrorException } from '@nestjs/common';

export class TransactionException extends InternalServerErrorException {
  public constructor() {
    super('Transaction error');
  }
}
