import { DeliveryStatus, Outbox }     from '.prisma/subscriptions';
import { DatabaseException }          from '@app/common/exceptions/database.exception';
import { Provider }                   from '@nestjs/common';

import {
  OutboxRepositoryInterface,
  OutboxUpdatePayload,
  OutboxWritePayload,
} from './outbox-repository.interface';
import type { PrismaTransactionType } from '../../interfaces/prisma-transaction.interface';
import { PrismaService }              from '../../prisma/prisma.service';

export class OutboxRepository extends OutboxRepositoryInterface {
  public constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async write(
    tx: PrismaTransactionType,
    payload: OutboxWritePayload,
  ): Promise<void> {
    try {
      await this.prisma.outbox.create({
        data: payload,
      });
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }

  public async read(): Promise<Outbox[]> {
    try {
      const result = await this.prisma.outbox.findMany({
        where: {
          OR: [
            {
              deliveryStatus: DeliveryStatus.FAILED,
            },
            {
              deliveryStatus: DeliveryStatus.PENDING,
            },
          ],
        },
      });

      return result;
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }

  public async update(id: string, updates: OutboxUpdatePayload): Promise<void> {
    try {
      await this.prisma.outbox.update({
        where: {
          id,
        },
        data: updates,
      });
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }
}

export const OutboxRepositoryProvider: Provider = {
  provide: OutboxRepositoryInterface,
  useClass: OutboxRepository,
};
