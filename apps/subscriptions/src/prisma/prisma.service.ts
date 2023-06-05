import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '.prisma/subscriptions';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  public constructor() {
    super();
  }

  private retryCount = 0;

  public async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      if (this.retryCount >= 3) {
        throw new Error('Can not connect to db');
      }

      await new Promise((res) => setTimeout(res, this.retryCount * 1000));

      this.retryCount++;

      await this.onModuleInit();
    }
  }

  public async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
