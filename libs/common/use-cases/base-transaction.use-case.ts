import { TransactionException } from '../exceptions/transaction.exception';
import { Tx }                   from '../types';

export interface BaseTransactionServiceType {
  $transaction<R, P>(
    fn: P,
    { timeout }: { timeout?: number; maxWait?: number },
  ): R;
}

export abstract class BaseTransactionUseCase<
  PS extends BaseTransactionServiceType,
  C,
  R,
> {
  private timeout = 10_000;

  private maxWait = 10_000;

  public constructor(private readonly prismaService: PS) {}

  protected abstract onExecute(command: C): Promise<R>;

  protected tx: Tx<PS>;

  public async execute(command: C) {
    try {
      const result = await this.prismaService.$transaction(
        async (tx: Tx<PS>) => {
          this.tx = tx;

          return this.onExecute(command);
        },
        {
          timeout: this.timeout,
          maxWait: this.maxWait,
        },
      );

      return result;
    } catch (error) {
      console.log(error);

      this.onError();
    }
  }

  protected onError() {
    throw new TransactionException();
  }
}
