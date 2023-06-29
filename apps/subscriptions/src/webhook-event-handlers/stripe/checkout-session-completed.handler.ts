import { PaymentStatus, SubscriptionStatus }   from '.prisma/subscriptions';
import {
  StripeCheckoutSessionObject,
  StripeEvent,
} from '@app/common/interfaces/events.interface';
import { createdSubscriptionMessageCreator }   from '@app/common/message-creators/created-subscription.message-creator';
import { updateUserAccountPlanMessageCreator } from '@app/common/message-creators/update-user-account-plan.message-creator';
import {
  SubscriptionCommand,
  SubscriptionEvent,
} from '@app/common/patterns/subscriptions.pattern';
import { Injectable }                          from '@nestjs/common';
import { EventEmitter2 as EventEmitter }       from '@nestjs/event-emitter';
import { AccountPlan }                         from '@prisma/client';
import { PaymentException }                    from 'apps/root/src/common/exceptions/subscriptions.exception';

import { PrismaService }                       from 'apps/subscriptions/src/prisma/prisma.service';
import { SubscriptionsQueryRepository }        from 'apps/subscriptions/src/repositories/subscriptions.query-repository';
import { SubscriptionsRepository }             from 'apps/subscriptions/src/repositories/subscriptions.repository';

import { CHECKOUT_SESSION_COMPLETED }          from '../../constants';
import { determineSubscriptionEndDate }        from '../../utils/calculate-subscription-end-date';
import { Handler }                             from '../abstract.handler';

@Injectable()
export class CheckoutSessinCompletedEventHandler extends Handler {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly subscriptionsQueryRepository: SubscriptionsQueryRepository,
    private readonly eventEmitter: EventEmitter,
  ) {
    super();
  }

  protected async doHandle(
    event: StripeEvent<StripeCheckoutSessionObject>,
  ): Promise<boolean> {
    if (event.type === CHECKOUT_SESSION_COMPLETED) {
      const { mode, payment_status: paymentStatus } = event.data.object;

      if (paymentStatus === 'paid' && mode === 'payment') {
        const { subscriptionId, paymentId, periodType, period } =
          event.data.object.metadata;

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

              if (currentActiveSubscription) {
                await this.subscriptionsRepository.cancelSubscription(
                  tx,
                  currentActiveSubscription.id,
                );
              }

              await this.subscriptionsRepository.updatePayments(tx, paymentId, {
                status: PaymentStatus.CONFIRMED,
              });

              const currentDate = new Date();

              let currentEndDate =
                currentActiveSubscription?.endDate || currentDate;

              currentEndDate =
                currentEndDate > currentDate ? currentEndDate : currentDate;

              const newEndDate = determineSubscriptionEndDate(
                currentEndDate,
                Number(period),
                periodType,
              );

              await this.subscriptionsRepository.updateSubscription(
                tx,
                subscriptionId,
                {
                  status: SubscriptionStatus.ACTIVE,
                  createdAt: new Date(),
                  endDate: newEndDate,
                },
              );

              const paymentOverallInformation =
                await this.subscriptionsQueryRepository.getOverallPaymentInformation(
                  tx,
                  paymentId,
                );

              if (
                !paymentOverallInformation ||
                !paymentOverallInformation.subscriptionPayment ||
                !paymentOverallInformation.subscriptionPayment.subscription
              ) {
                throw new PaymentException();
              }

              const {
                id,
                currency,
                price,
                provider,
                status,
                subscriptionPayment: {
                  subscription: { endDate, startDate, type },
                },
              } = paymentOverallInformation;

              const subscriptionCreatedEvent =
                SubscriptionEvent.SubscriptionCreated;

              this.eventEmitter.emit(subscriptionCreatedEvent, {
                event: subscriptionCreatedEvent,
                message: createdSubscriptionMessageCreator({
                  id,
                  currency,
                  price,
                  endDate,
                  startDate,
                  provider,
                  status,
                  type,
                  userId,
                  period: Number(period),
                  periodType,
                }),
              });

              const updateUserAccountPlanCommand =
                SubscriptionCommand.UpdateUserAccountPlan;

              this.eventEmitter.emit(updateUserAccountPlanCommand, {
                event: updateUserAccountPlanCommand,
                message: updateUserAccountPlanMessageCreator({
                  userId,
                  plan: AccountPlan.BUSINESS,
                }),
              });

              // outbox here
            }
          },
          {
            timeout: this.timeout,
            maxWait: this.maxWait,
          },
        );

        return false;
      }
    }

    return true;
  }

  private timeout = 10_000;

  private maxWait = 10_000;
}
