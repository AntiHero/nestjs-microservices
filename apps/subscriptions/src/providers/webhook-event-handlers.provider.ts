import { Provider }                            from '@nestjs/common';

import { WEBHOOK_EVENT_HANDLERS }              from '../constants';
import { CheckoutSessinCompletedEventHandler } from '../webhook-event-handlers/stripe/checkout-session-completed.handler';
import { InvoicePaymentSucceededEventHandler } from '../webhook-event-handlers/stripe/invoice-payment-succeded.handler';

export const webhookEventHandlers = [
  CheckoutSessinCompletedEventHandler,
  InvoicePaymentSucceededEventHandler,
];

export const WebhookEventHandlersProvider: Provider = {
  provide: WEBHOOK_EVENT_HANDLERS,
  useFactory(...handlers) {
    return handlers;
  },
  inject: [...webhookEventHandlers],
};
