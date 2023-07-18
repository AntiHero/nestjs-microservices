import { Outbox }                from '.prisma/subscriptions';
import { Prisma }                from '@prisma/client';

import { PrismaTransactionType } from '../../interfaces/prisma-transaction.interface';

export type OutboxWritePayload = Pick<Outbox, 'event' | 'message'> & {
  message: Prisma.InputJsonObject;
};

export type OutboxUpdatePayload = Partial<
  Pick<Outbox, 'deliveryStatus' | 'retryCount'>
>;

export abstract class OutboxRepositoryInterface {
  public abstract write(
    tx: PrismaTransactionType,
    payload: OutboxWritePayload,
  ): Promise<void>;

  public abstract read(): Promise<Outbox[]>;

  public abstract update(
    id: string,
    updates: OutboxUpdatePayload,
  ): Promise<void>;
}
