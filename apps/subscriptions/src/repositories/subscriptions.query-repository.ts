import {
  Payment,
  PaymentStatus,
  Subscription,
  SubscriptionPayment,
  SubscriptionPricingPlan,
  SubscriptionStatus,
} from '.prisma/subscriptions';
import { PaymentsQueryDto }      from '@app/common/dtos/payments-query.dto';
import { DatabaseException }     from '@app/common/exceptions/database.exception';
import { CurrentSubscription }   from '@app/common/interfaces/current-subscription.interface';
import { Injectable }            from '@nestjs/common';

import { PrismaService }         from 'apps/subscriptions/src/prisma/prisma.service';

import { Payments }              from '../interfaces';
import { PrismaTransactionType } from '../interfaces/prisma-transaction.interface';

@Injectable()
export class SubscriptionsQueryRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getSubscriptionPricingPlanByQuery(
    query: Partial<SubscriptionPricingPlan>,
  ) {
    try {
      const result =
        this.prismaService.subscriptionPricingPlan.findFirstOrThrow({
          where: query,
        });

      return result;
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }

  public async getSubscriptionPriceById(id: string) {
    try {
      const result = this.prismaService.subscriptionPrice.findUnique({
        where: {
          id,
        },
      });

      return result;
    } catch (error) {
      console.log(error);

      new DatabaseException();
    }
  }

  public async getPaymentByQuery(
    query: Partial<Pick<Payment, 'id' | 'userId' | 'status'>>,
  ) {
    try {
      const result = this.prismaService.payment.findFirstOrThrow({
        where: query,
      });

      return result;
    } catch (error) {
      console.log(error);

      new DatabaseException();
    }
  }

  public async getPriceById(id: string) {
    try {
      const result = this.prismaService.subscriptionPrice.findUniqueOrThrow({
        where: {
          id,
        },
      });

      return result;
    } catch (error) {
      console.log(error);

      new DatabaseException();
    }
  }

  public async getPriceList() {
    try {
      const result = this.prismaService.subscriptionPrice.findMany({
        select: {
          id: true,
          currency: true,
          period: true,
          value: true,
          periodType: true,
        },
      });

      return result;
    } catch (error) {
      console.log(error);

      new DatabaseException();
    }
  }

  public async getPaymentsByQuery(
    userId: string,
    query: PaymentsQueryDto,
  ): Promise<[number, Payments[]]> {
    const { page, pageSize } = query;

    try {
      const count = await this.prismaService.payment.count({
        where: {
          userId,
          status: PaymentStatus.CONFIRMED,
        },
      });

      const payments = await this.prismaService.payment.findMany({
        where: {
          userId,
          status: PaymentStatus.CONFIRMED,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          price: true,
          provider: true,
          subscriptionPayment: {
            include: {
              subscription: {
                select: {
                  startDate: true,
                  endDate: true,
                },
              },
              pricingPlan: {
                include: {
                  price: {
                    select: {
                      period: true,
                      periodType: true,
                    },
                  },
                },
              },
            },
          },
        },
        take: pageSize,
        skip: (<number>page - 1) * <number>pageSize,
      });

      return [count, payments];
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }

  public async getUserCurrentSubscription(
    userId: string,
  ): Promise<CurrentSubscription | null> {
    try {
      const result = this.prismaService.subscription.findFirst({
        where: {
          userId,
          status: SubscriptionStatus.ACTIVE,
          endDate: {
            gt: new Date(),
          },
        },
        select: {
          id: true,
          endDate: true,
          startDate: true,
          subscriptionPayment: {
            select: {
              pricingPlan: {
                select: {
                  subscriptionType: true,
                  price: {
                    select: {
                      currency: true,
                      period: true,
                      periodType: true,
                      value: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return result;
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }

  public async getSubscriptionByQuery(query: Partial<Subscription>) {
    try {
      const result = this.prismaService.subscription.findFirst({
        where: query,
        include: {
          subscriptionPayment: {
            select: {
              id: true,
              paymentId: true,
            },
          },
        },
      });

      return result;
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }

  public async getSubscriptionPaymentByQuery(
    query: Partial<Pick<SubscriptionPayment, 'id' | 'paymentId'>>,
  ) {
    try {
      const result =
        await this.prismaService.subscriptionPayment.findFirstOrThrow({
          where: query,
        });

      return result;
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }

  public async getOverallPaymentInformation(
    tx: PrismaTransactionType,
    id: string,
  ) {
    try {
      const result = await tx.payment.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          userId: true,
          price: true,
          provider: true,
          currency: true,
          status: true,
          subscriptionPayment: {
            select: {
              subscription: {
                select: {
                  endDate: true,
                  startDate: true,
                  type: true,
                },
              },
            },
          },
        },
      });

      return result;
    } catch (error) {}
  }
}
