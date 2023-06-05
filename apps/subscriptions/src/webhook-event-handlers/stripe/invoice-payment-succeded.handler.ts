import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
// import {
//   Payment,
//   PaymentProvider,
//   PaymentStatus,
//   SubscriptionPrice,
//   SubscriptionStatus,
// } from '.prisma/subscriptions';

import {
  StripeEvent,
  StripeInvoiceObject,
} from '@app/common/interfaces/events.interface';
import { Handler } from '../abstract.handler';
import { PrismaService } from 'apps/subscriptions/src/prisma/prisma.service';
import { INVOICE_PAYMENT_SUCCEEDED } from '../../constants';
// import { PaymentProviderService } from 'apps/subscriptions/src/services/payment-provider.service';
// import { InjectStripeService } from 'apps/root/src/common/decorators/inject-stripe-service.decorator';
// import { calculateSubscriptionEndDate } from 'apps/subscriptions/src/utils/calculate-subscription-end-date';
import { SubscriptionsQueryRepository } from 'apps/subscriptions/src/repositories/subscriptions.query-repository';
// import { SubscriptionsTransactionService } from 'apps/subscriptions/src/services/subscriptions-transaction.service';
// import { ProcessPendingSubscriptionPaymentCommand } from 'apps/subscriptions/src/use-cases/process-pending-subscription-payment.use-case';
// import { ProcessActiveSubscriptionPaymentCommand } from 'apps/subscriptions/src/use-cases/process-active-subscription-payment.use-case';

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
