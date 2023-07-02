import { parentPort }             from 'worker_threads';

import { DeliveryStatus }         from '.prisma/subscriptions';
import { Queue }                  from '@app/common/queues';
import { ClientProxy, ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom }         from 'rxjs';

import { PrismaService }          from '../prisma/prisma.service';

export class OutboxProcessor {
  private timeout = 3000;

  public prisma: PrismaService;

  public adminRmqClient: ClientProxy;

  public async reconnect() {
    this.adminRmqClient = new ClientRMQ({
      queue: Queue.Admin,
      urls: [process.env.RABBIT_MQ_URI || 'amqp://locahost:5672'],
    });

    console.log('reconnecting...');
    await this.adminRmqClient.connect().catch(() => null);
  }

  public constructor() {
    this.prisma = new PrismaService();
    this.adminRmqClient = new ClientRMQ({
      queue: Queue.Admin,
      urls: [process.env.RABBIT_MQ_URI || 'amqp://locahost:5672'],
    });
    this.reconnect = this.reconnect.bind(this);
  }

  public async run(delay?: number) {
    const prisma = this.prisma;
    const client = this.adminRmqClient;
    const reconnect = this.reconnect;

    async function processOutbox() {
      try {
        const messages = await prisma.outbox.findMany({
          where: {
            OR: [
              {
                deliveryStatus: DeliveryStatus.PENDING,
              },
              {
                deliveryStatus: DeliveryStatus.FAILED,
              },
            ],
          },
        });

        const promises = messages.map(async (msg) => {
          const { id, event, message } = msg;

          try {
            await firstValueFrom(client.emit(event, message));

            await prisma.outbox.update({
              where: {
                id,
              },
              data: {
                deliveryStatus: DeliveryStatus.SENT,
              },
            });
          } catch (e: any) {
            console.log(e, 'error');

            await prisma.outbox.update({
              where: {
                id,
              },
              data: {
                retryCount: {
                  increment: 1,
                },
                deliveryStatus: DeliveryStatus.FAILED,
              },
            });

            if (
              !(<any>client).connection$ ||
              (<any>client).connection$.hasError
            ) {
              await reconnect();
            }
          }
        });

        await Promise.all(promises);
      } catch (error: any) {
        console.log(error);
      }
    }

    const start = Date.now();

    await processOutbox();

    const end = Date.now();

    if (end - start < (delay || this.timeout)) {
      await new Promise((res) =>
        setTimeout(res, (delay || this.timeout) - (end - start)),
      );
    }

    await this.run();
  }
}

const worker = new OutboxProcessor();

parentPort?.on('message', async () => {
  worker.run();

  parentPort?.postMessage('OutboxProcessor is running...');
});
