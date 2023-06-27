import {
  StripeEvent,
  StripeInvoiceObject,
} from '@app/common/interfaces/events.interface';
import { Injectable }                from '@nestjs/common';

import { INVOICE_PAYMENT_SUCCEEDED } from '../../constants';
import { Handler }                   from '../abstract.handler';

@Injectable()
export class InvoicePaymentSucceededEventHandler extends Handler {
  public constructor() {
    super();
  }

  protected async doHandle(
    event: StripeEvent<StripeInvoiceObject>,
  ): Promise<boolean> {
    if (event.type === INVOICE_PAYMENT_SUCCEEDED) {
      return false;
    }

    return true;
  }
}
