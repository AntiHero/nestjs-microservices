import { Injectable }     from '@nestjs/common';
import { OnEvent }        from '@nestjs/event-emitter';

import { AdminRmqClient } from './services/admin-rmq-client.service';

export const NOTIFY_ADMIN_EVENT = 'notify_admin';

@Injectable()
export class EventRouter {
  public constructor(private readonly adminRmqClient: AdminRmqClient) {}

  @OnEvent(NOTIFY_ADMIN_EVENT)
  public rootEvent<T>([event, payload]: [string, T]) {
    this.adminRmqClient.emitMessage(event, payload);
  }
}
