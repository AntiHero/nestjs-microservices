import { Inject, Injectable } from '@nestjs/common';
import {
  SubscriptionType,
  SubscriptionStatus,
  PaymentStatus,
  SubscriptionPrice,
} from '.prisma/subscriptions';

import { Handler } from '../abstract.handler';
import {
  StripeCheckoutSessionObject,
  StripeEvent,
} from '@app/common/interfaces/events.interface';
import { CHECKOUT_SESSION_COMPLETED } from '../../constants';
import { PrismaService } from 'apps/subscriptions/src/prisma/prisma.service';
import { calculateSubscriptionEndDate } from '../../utils/calculate-subscription-end-date';
import { SubscriptionsTransactionService } from 'apps/subscriptions/src/services/subscriptions-transaction.service';
import { SubscriptionsQueryRepository } from 'apps/subscriptions/src/repositories/subscriptions.query-repository';
import { ClientProxy } from '@nestjs/microservices';
import { RootEvents } from '@app/common/patterns/root.patterns';
import { AccountPlan } from '@prisma/client';

@Injectable()
export class CheckoutSessinCompletedEventHandler extends Handler {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly subscriptionsTransactionService: SubscriptionsTransactionService,
    private readonly subscriptionsQueryRepository: SubscriptionsQueryRepository,
    @Inject('ROOT_RMQ') private readonly rootRmqClient: ClientProxy,
  ) {
    super();
  }

  protected async doHandle(
    event: StripeEvent<StripeCheckoutSessionObject>,
  ): Promise<boolean> {
    if (event.type === CHECKOUT_SESSION_COMPLETED) {
      const { mode, payment_status: paymentStatus } = event.data.object;

      if (paymentStatus === 'paid' && mode === 'payment') {
        const { subscriptionId, paymentId } = event.data.object.metadata;

        await this.prismaService.$transaction(
          async (tx) => {
            const currentPendingSubscription =
              await this.subscriptionsQueryRepository.getSubscriptionByQuery({
                id: subscriptionId,
                status: SubscriptionStatus.PENDING,
              });

            if (currentPendingSubscription) {
              const { userId } = currentPendingSubscription;

              const currentActiveSubscription =
                await this.subscriptionsQueryRepository.getSubscriptionByQuery({
                  userId,
                  status: SubscriptionStatus.ACTIVE,
                });

              if (
                currentActiveSubscription?.type === SubscriptionType.ONETIME
              ) {
                await this.subscriptionsTransactionService.cancelSubscription(
                  tx,
                  currentActiveSubscription.id,
                );
              }

              const { subscriptionPayment } =
                await this.subscriptionsTransactionService.updatePayments(
                  tx,
                  paymentId,
                  {
                    status: PaymentStatus.CONFIRMED,
                  },
                );

              const subscriptionPriceId = <string>(
                subscriptionPayment?.pricingPlan.priceId
              );

              const currentDate = new Date();
              let currentEndDate =
                currentActiveSubscription?.endDate || currentDate;

              currentEndDate =
                currentEndDate && currentEndDate > currentDate
                  ? currentEndDate
                  : currentDate;

              const { period, periodType } = <SubscriptionPrice>(
                await this.subscriptionsQueryRepository.getPriceById(
                  subscriptionPriceId,
                )
              );

              const newEndDate = calculateSubscriptionEndDate(
                currentEndDate,
                period,
                periodType,
              );

              await Promise.all([
                this.subscriptionsTransactionService.updateSubscription(
                  tx,
                  subscriptionId,
                  {
                    status: SubscriptionStatus.ACTIVE,
                    createdAt: new Date(),
                    endDate: newEndDate,
                  },
                ),
                // move to rabbitmq
                // this.userRepository.updateAccountPlan(
                //   tx,
                //   userId,
                //   AccountPlan.BUSINESS,
                // ),
              ]);

              this.rootRmqClient.emit(RootEvents.updateUserAccountPlan, {
                userId,
                plan: AccountPlan.BUSINESS,
              });
              // this.rootRmqClient.
            }
          },
          {
            timeout: 10_000,
          },
        );

        return false;
      }
    }

    return true;
  }
}
