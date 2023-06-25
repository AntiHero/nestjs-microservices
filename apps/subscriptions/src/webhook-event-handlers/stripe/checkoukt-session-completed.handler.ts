import {
  PaymentStatus,
  SubscriptionPrice,
  SubscriptionStatus,
  SubscriptionType,
} from '.prisma/subscriptions';
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
import { SubscriptionsTransactionService }     from 'apps/subscriptions/src/services/subscriptions-transaction.service';

import { CHECKOUT_SESSION_COMPLETED }          from '../../constants';
import { determineSubscriptionEndDate }        from '../../utils/calculate-subscription-end-date';
import { Handler }                             from '../abstract.handler';

@Injectable()
export class CheckoutSessinCompletedEventHandler extends Handler {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly subscriptionsTransactionService: SubscriptionsTransactionService,
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

              const newEndDate = determineSubscriptionEndDate(
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
              ]);

              const paymentOverallInformation =
                await this.subscriptionsQueryRepository.getOverallPaymentInformation(
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
                  period,
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
            }
          },
          {
            // TODO: I want to get rid of this
            timeout: 10_000,
          },
        );

        return false;
      }
    }

    return true;
  }
}
