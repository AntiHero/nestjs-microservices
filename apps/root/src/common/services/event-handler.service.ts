import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';

import { AdminRmqClient } from './admin-rmq-client.service';

export const NOTIFY_ADMIN_EVENT = 'notify_admin';

@Injectable()
export class EventHandlerService {
  public constructor(private readonly adminRmqClient: AdminRmqClient) {}

  @OnEvent(NOTIFY_ADMIN_EVENT)
  public rootEvent<T>([event, payload]: [string, T]) {
    console.log(event, payload);
    this.adminRmqClient.emitMessage(event, payload);
  }
}
