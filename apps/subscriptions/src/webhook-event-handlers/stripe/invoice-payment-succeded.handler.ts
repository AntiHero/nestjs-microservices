import {
  StripeEvent,
  StripeInvoiceObject,
} from '@app/common/interfaces/events.interface';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { PrismaService } from 'apps/subscriptions/src/prisma/prisma.service';
import { SubscriptionsQueryRepository } from 'apps/subscriptions/src/repositories/subscriptions.query-repository';

import { INVOICE_PAYMENT_SUCCEEDED } from '../../constants';
import { Handler } from '../abstract.handler';

@Injectable()
export class InvoicePaymentSucceededEventHandler extends Handler {
  public constructor(
    private readonly subscriptionsQueryRepository: SubscriptionsQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly prismaService: PrismaService,
  ) {
    super();
  }

  protected async doHandle(
    event: StripeEvent<StripeInvoiceObject>,
  ): Promise<boolean> {
    if (event.type === INVOICE_PAYMENT_SUCCEEDED) {
      const {
        id: invoice,
        subscription: relatedSubscription,
        hosted_invoice_url: invoiceUrl,
      } = event.data.object;

      // const currentPendingSubscription =
      //   await this.subscriptionsQueryRepository.getSubscriptionByQuery({
      //     relatedSubscription,
      //     status: SubscriptionStatus.PENDING,
      //   });

      // console.log(currentPendingSubscription, 'currentPendingSubscription');

      // if (currentPendingSubscription) {
      //   const {
      //     id,
      //     userId,
      //     subscriptionPayment: { paymentId },
      //   } = currentPendingSubscription;

      //   await this.commandBus.execute(
      //     new ProcessPendingSubscriptionPaymentCommand(id, paymentId, userId, {
      //       invoice,
      //       invoiceUrl,
      //     }),
      //   );
      // } else {
      //   await this.commandBus.execute(
      //     new ProcessActiveSubscriptionPaymentCommand(relatedSubscription),
      //   );
      // }

      return false;
    }

    return true;
  }
}
